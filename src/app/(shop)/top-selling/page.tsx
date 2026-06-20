import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import ProductGrid from "@/components/ProductGrid"
import { getProductsByCategory } from "@/lib/data/products"
import { pageTitle } from "@/lib/metadata"

export const metadata: Metadata = {
  title: pageTitle("Top Selling"),
  description: "Customer favorites and bestsellers from BackStreet.",
}

export default async function TopSellingPage() {
  const products = await getProductsByCategory("topSelling", 48)

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <nav
          className="mb-8 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <span className="text-foreground">Top Selling</span>
        </nav>

        <h1 className="text-center text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
          Top Selling
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
          Customer favorites and bestsellers. Open any item for full details
          and options.
        </p>

        <div className="mt-10">
          <ProductGrid products={products} source="topSelling" />
        </div>
      </div>
    </div>
  )
}
