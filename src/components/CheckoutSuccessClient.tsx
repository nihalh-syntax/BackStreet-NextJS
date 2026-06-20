"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { completeOrder } from "@/app/actions/checkout"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"

type CheckoutSuccessClientProps = {
  sessionId: string | null
}

export function CheckoutSuccessClient({
  sessionId,
}: CheckoutSuccessClientProps) {
  const { clearCart } = useCart()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    sessionId ? "loading" : "success",
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    let cancelled = false

    void (async () => {
      const result = await completeOrder(sessionId)
      if (cancelled) return

      if (result.ok) {
        clearCart()
        setStatus("success")
      } else {
        setError(result.error)
        setStatus("error")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [sessionId, clearCart])

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-lg bg-background px-4 py-20 text-center">
        <p className="text-muted-foreground">Confirming your order…</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-lg bg-background px-4 py-20 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground">
          {error ?? "We could not confirm your payment."}
        </p>
        <Button asChild className="mt-10 rounded-full">
          <Link href="/cart">Return to cart</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg bg-background px-4 py-20 text-center">
      <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
        Thank you
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your payment was received. You will receive a confirmation from Stripe
        by email.
      </p>
      {sessionId && (
        <p className="mt-4 break-all text-xs text-muted-foreground">
          Session reference: {sessionId}
        </p>
      )}
      <Button asChild className="mt-10 rounded-full">
        <Link href="/">Continue shopping</Link>
      </Button>
    </div>
  )
}
