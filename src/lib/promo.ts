import { prisma } from "@/lib/prisma"

export async function getPromoDiscountFlat(code: string | null | undefined) {
  const normalized = code?.trim().toUpperCase()
  if (!normalized) return 0

  const promo = await prisma.promoCode.findUnique({
    where: { code: normalized },
  })

  if (!promo?.active) return 0
  return Number(promo.discountFlat)
}

export async function validatePromoInDb(code: string) {
  const normalized = code.trim().toUpperCase()
  if (!normalized) {
    return { ok: false as const, error: "Enter a code" }
  }

  const promo = await prisma.promoCode.findUnique({
    where: { code: normalized },
  })

  if (!promo?.active) {
    return {
      ok: false as const,
      error: "Invalid code. Try SAVE10 or WELCOME.",
    }
  }

  return {
    ok: true as const,
    code: normalized,
    discountFlat: Number(promo.discountFlat),
  }
}
