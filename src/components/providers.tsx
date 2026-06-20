"use client"

import { ClerkProvider } from "@clerk/nextjs"
import type { ReactNode } from "react"

import { CartProvider } from "@/context/CartContext"
import { AppThemeProvider } from "@/theme"

function getClerkPublishableKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (or VITE_CLERK_PUBLISHABLE_KEY in .env.local).",
    )
  }
  return key
}

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppThemeProvider>
      <ClerkProvider publishableKey={getClerkPublishableKey()}>
        <CartProvider>{children}</CartProvider>
      </ClerkProvider>
    </AppThemeProvider>
  )
}
