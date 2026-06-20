import type { Metadata } from "next"

import { ShopShell } from "@/components/ShopShell"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  description: "Premium streetwear and fashion.",
}

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ShopShell>{children}</ShopShell>
}
