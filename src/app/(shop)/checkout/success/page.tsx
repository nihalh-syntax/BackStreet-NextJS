import type { Metadata } from "next"

import { CheckoutSuccessClient } from "@/components/CheckoutSuccessClient"
import { pageTitle } from "@/lib/metadata"

export const metadata: Metadata = {
  title: pageTitle("Order Confirmed"),
  description: "Your BackStreet order was received.",
}

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id ?? null

  return <CheckoutSuccessClient sessionId={sessionId} />
}
