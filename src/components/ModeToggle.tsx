"use client"

import { useEffect, useState } from "react"
import { Contrast } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAppTheme } from "@/theme"

/** Single-click light ↔ dark toggle (Shadcn-style, Contrast icon). */
const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useAppTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 rounded-full"
        disabled
        aria-hidden
      >
        <span className="size-5" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-10 shrink-0 rounded-full text-foreground hover:bg-muted"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Contrast className="size-5" strokeWidth={1.75} aria-hidden />
    </Button>
  )
}

export default ModeToggle
