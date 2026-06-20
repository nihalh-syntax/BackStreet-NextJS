"use client"

import { useState } from "react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function FooterNewsletter() {
  const [email, setEmail] = useState("")

  return (
    <div
      className={cn(
        "-mt-16 flex flex-col gap-8 rounded-3xl bg-black px-6 py-10 text-white md:-mt-20 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-12 lg:px-14",
      )}
    >
      <h2 className="max-w-xl text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl lg:text-[2.25rem]">
        Stay upto date about our latest offers
      </h2>
      <div className="flex w-full max-w-md flex-col gap-3 md:shrink-0">
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-12 rounded-full border-0 bg-white pl-12 pr-4 text-neutral-950 placeholder:text-neutral-500"
            aria-label="Email for newsletter"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-12 rounded-full bg-white font-semibold text-neutral-950 hover:bg-neutral-100"
          onClick={(e) => e.preventDefault()}
        >
          Subscribe to Newsletter
        </Button>
      </div>
    </div>
  )
}
