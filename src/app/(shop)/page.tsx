import type { Metadata } from "next"

import { HomeHashScroll } from "@/components/HomeHashScroll"
import BrowseSection from "@/components/BrowseSection"
import NewArrivalsSection from "@/components/NewArrivalsSection"
import TopSellingSection from "@/components/TopSellingSection"
import Hero from "@/components/pages/Hero"
import { getFeaturedProducts } from "@/lib/data/products"

export const metadata: Metadata = {
  title: { absolute: "BackStreet" },
  description: "Premium streetwear and fashion.",
}

export default async function HomePage() {
  const { newArrivals, topSelling } = await getFeaturedProducts()

  return (
    <HomeHashScroll>
      <Hero />
      <NewArrivalsSection products={newArrivals} />
      <TopSellingSection products={topSelling} />
      <BrowseSection />
    </HomeHashScroll>
  )
}
