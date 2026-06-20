"use client"

import type { ReactNode } from "react"

import Footer from "@/components/Footer"
import NavBar from "@/components/NavBar"

type ShopShellProps = {
  children: ReactNode
}

/** Client shell for shop chrome (nav, cart badge, auth, theme toggle). */
export function ShopShell({ children }: ShopShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 bg-background">{children}</main>
      <Footer />
    </div>
  )
}
