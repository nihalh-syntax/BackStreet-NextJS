import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import StarRating from "@/components/ui/StarRating"

export type ProductItem = {
  id: string
  name: string
  imageUrl: string
  rating: number
  price: number
  originalPrice?: number
}

type ProductCardProps = {
  product: ProductItem
  href?: string
}

const ProductCard = ({ product, href }: ProductCardProps) => {
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const inner = (
    <>
      <div className="overflow-hidden rounded-2xl bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="aspect-4/5 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="space-y-1">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">{product.name}</h3>
        <StarRating rating={product.rating} />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-foreground">${product.price}</span>
        {hasDiscount && (
          <>
            <span className="text-2xl text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
            <Badge className="bg-red-100 text-red-500 hover:bg-red-100">-{discountPercent}%</Badge>
          </>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="group flex min-w-0 flex-col gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {inner}
      </Link>
    )
  }

  return <article className="group flex min-w-0 flex-col gap-3">{inner}</article>
}

export default ProductCard
