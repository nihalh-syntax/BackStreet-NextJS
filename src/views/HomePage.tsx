import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import Hero from "@/components/pages/Hero"
import BrowseSection from "@/components/BrowseSection"
import NewArrivalsSection from "@/components/NewArrivalsSection"
import TopSellingSection from "@/components/TopSellingSection"

const HomePage = () => {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash.replace(/^#/, "")
    if (!id) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  return (
    <>
      <Hero />
      <NewArrivalsSection />
      <TopSellingSection />
      <BrowseSection />
    </>
  )
}

export default HomePage
