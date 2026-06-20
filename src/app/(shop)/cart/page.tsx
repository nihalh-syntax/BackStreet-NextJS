import type { Metadata } from "next"

import { CartPageClient } from "@/components/CartPageClient"
import { pageTitle } from "@/lib/metadata"

export const metadata: Metadata = {
  title: pageTitle("Cart"),
  description: "Review your BackStreet cart and checkout securely.",
}

export default function CartPage() {
  return <CartPageClient />
}
