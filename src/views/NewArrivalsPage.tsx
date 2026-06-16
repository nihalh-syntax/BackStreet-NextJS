import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import ProductGrid from "@/components/ProductGrid"
import { useFirestoreProducts } from "@/hooks/useFirestoreProducts"
import { NEW_ARRIVALS_FALLBACK } from "@/data/productCatalog"

const PAGE_LIMIT = 48

const NewArrivalsPage = () => {
  const { products, loading, error } = useFirestoreProducts({
    collectionName: "newArrivals",
    maxProducts: PAGE_LIMIT,
    fallback: NEW_ARRIVALS_FALLBACK,
  })

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <nav
          className="mb-8 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <span className="text-foreground">New Arrivals</span>
        </nav>

        <h1 className="text-center text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
          New Arrivals
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
          Latest drops and seasonal pieces. Tap a product for details, sizes, and
          colors.
        </p>

        {loading && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Loading products…
          </p>
        )}

        {error && !loading && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Could not load live catalog. Showing sample items.
          </p>
        )}

        <div className="mt-10">
          <ProductGrid products={products} source="newArrivals" />
        </div>
      </div>
    </div>
  )
}

export default NewArrivalsPage
