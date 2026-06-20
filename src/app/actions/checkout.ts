"use server"

import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"

import type { ProductSource } from "@/data/productCatalog"
import { getUserByClerkId } from "@/lib/clerk/sync-user"
import {
  productSourceToCategory,
  slugFromLegacyId,
} from "@/lib/data/products"
import { computeOrderTotal } from "@/lib/orderTotals"
import { getPromoDiscountFlat, validatePromoInDb } from "@/lib/promo"
import { prisma } from "@/lib/prisma"

export type CheckoutLineInput = {
  productId: string
  source: ProductSource
  unitPrice: number
  quantity: number
  size: string
  colorLabel: string
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

function appOrigin() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  )
}

function parseCheckoutLines(lines: unknown): CheckoutLineInput[] {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error("Cart is empty.")
  }

  const clean: CheckoutLineInput[] = []
  for (const row of lines) {
    if (!row || typeof row !== "object") {
      throw new Error("Invalid cart payload.")
    }
    const r = row as Record<string, unknown>
    const source = r.source
    const productId = r.productId
    const unitPrice = Number(r.unitPrice)
    const quantity = Number(r.quantity)
    const size = r.size
    const colorLabel = r.colorLabel

    if (
      (source !== "newArrivals" && source !== "topSelling") ||
      typeof productId !== "string" ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0 ||
      !Number.isFinite(quantity) ||
      quantity < 1 ||
      !Number.isInteger(quantity) ||
      typeof size !== "string" ||
      typeof colorLabel !== "string"
    ) {
      throw new Error("Invalid line item.")
    }

    clean.push({
      productId,
      source,
      unitPrice,
      quantity,
      size,
      colorLabel,
    })
  }

  return clean
}

export async function validatePromoCode(code: string) {
  return validatePromoInDb(code)
}

export async function createCheckoutSession(
  linesInput: unknown,
  promoCode: string | null | undefined,
) {
  try {
    const stripe = getStripe()
    if (!stripe) {
      return { ok: false as const, error: "Stripe is not configured." }
    }

    const lines = parseCheckoutLines(linesInput)
    const promoFlat = await getPromoDiscountFlat(promoCode ?? null)
    const totals = computeOrderTotal(
      lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })),
      promoFlat,
    )

    const amountCents = Math.round(totals.total * 100)
    if (amountCents < 50) {
      return { ok: false as const, error: "Order total is too small to charge." }
    }

    const productRows = await Promise.all(
      lines.map(async (line) => {
        const slug = slugFromLegacyId(
          productSourceToCategory(line.source),
          line.productId,
        )
        const product = await prisma.product.findUnique({ where: { slug } })
        if (!product) {
          throw new Error(`Product not found: ${line.productId}`)
        }
        return { line, product }
      }),
    )

    const { userId: clerkUserId } = await auth()
    let dbUserId: string | undefined
    if (clerkUserId) {
      const user = await getUserByClerkId(clerkUserId)
      dbUserId = user?.id
    }

    const normalizedPromo = promoCode?.trim().toUpperCase() || null
    const origin = appOrigin()

    const order = await prisma.order.create({
      data: {
        userId: dbUserId,
        status: "pending",
        subtotal: totals.subtotal,
        discount: totals.discount20 + totals.promoOff,
        delivery: totals.delivery,
        total: totals.total,
        promoCode: normalizedPromo,
        items: {
          create: productRows.map(({ line, product }) => ({
            productId: product.id,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            size: line.size,
            colorLabel: line.colorLabel,
          })),
        },
      },
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BackStreet order",
              description: "Thank you for shopping with BackStreet.",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order.id,
      },
    })

    if (!session.url) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "cancelled" },
      })
      return { ok: false as const, error: "No checkout URL returned." }
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return { ok: true as const, url: session.url }
  } catch (e) {
    console.error("createCheckoutSession", e)
    return {
      ok: false as const,
      error:
        e instanceof Error ? e.message : "Could not start checkout. Try again.",
    }
  }
}

export async function completeOrder(sessionId: string) {
  if (!sessionId.trim()) {
    return { ok: false as const, error: "Missing session reference." }
  }

  try {
    const stripe = getStripe()
    if (!stripe) {
      return { ok: false as const, error: "Stripe is not configured." }
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") {
      return { ok: false as const, error: "Payment not completed." }
    }

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!order) {
      return { ok: false as const, error: "Order not found." }
    }

    if (order.status === "paid") {
      return { ok: true as const, orderId: order.id, alreadyCompleted: true }
    }

    const { userId: clerkUserId } = await auth()
    let dbUserId = order.userId
    if (clerkUserId) {
      const user = await getUserByClerkId(clerkUserId)
      if (user) dbUserId = user.id
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        userId: dbUserId,
      },
    })

    return { ok: true as const, orderId: order.id, alreadyCompleted: false }
  } catch (e) {
    console.error("completeOrder", e)
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Could not complete order.",
    }
  }
}
