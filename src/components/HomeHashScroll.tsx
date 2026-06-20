"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

type HomeHashScrollProps = {
  children: React.ReactNode
}

/** Smooth-scroll to hash targets on the home page (e.g. /#new-arrivals). */
export function HomeHashScroll({ children }: HomeHashScrollProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return

    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "")
      if (!id) return
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      })
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)
    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [pathname])

  return children
}
