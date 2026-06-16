import { Link, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"

const CheckoutSuccessPage = () => {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")

  return (
    <div className="mx-auto max-w-lg bg-background px-4 py-20 text-center">
      <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
        Thank you
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your payment was received. You will receive a confirmation from Stripe by
        email.
      </p>
      {sessionId && (
        <p className="mt-4 break-all text-xs text-muted-foreground">
          Session reference: {sessionId}
        </p>
      )}
      <Button asChild className="mt-10 rounded-full">
        <Link to="/">Continue shopping</Link>
      </Button>
    </div>
  )
}

export default CheckoutSuccessPage
