import { cn } from "@/lib/utils"
import { productDetailPath } from "@/lib/productRoutes"
import type { ProductSource } from "@/data/productCatalog"

import ProductCard, { type ProductItem } from "./ProductCard"

/** Product that optionally carries its own source for mixed-source grids. */
type GridProduct = ProductItem & { source?: ProductSource }

type ProductGridProps = {
  products: GridProduct[]
  /** Fallback source for items that don't specify their own. */
  source?: ProductSource
  className?: string
  /** Grid column classes; default responsive 2–4 columns. */
  gridClassName?: string
}

/**
 * Reusable responsive grid of product cards linking to product detail routes.
 * Each item may carry its own `source`; otherwise the grid-level `source` is used.
 */
const ProductGrid = ({
  products,
  source,
  className,
  gridClassName,
}: ProductGridProps) => {
  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          gridClassName,
        )}
      >
        {products.map((product) => {
          const itemSource = product.source ?? source
          return (
            <ProductCard
              key={`${itemSource ?? "x"}-${product.id}`}
              product={product}
              href={
                itemSource
                  ? productDetailPath(itemSource, product.id)
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}

export default ProductGrid
