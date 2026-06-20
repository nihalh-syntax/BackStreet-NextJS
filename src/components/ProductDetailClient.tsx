"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Filter, MoreVertical } from "lucide-react"

import ProductCard from "@/components/ProductCard"
import StarRating from "@/components/ui/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ProductDetailData, ProductSource } from "@/data/productCatalog"
import { useCart } from "@/context/CartContext"
import type { RelatedProduct } from "@/lib/data/products"
import { productDetailPath } from "@/lib/productRoutes"
import { cn } from "@/lib/utils"

type TabId = "details" | "reviews" | "faqs"

type ProductDetailClientProps = {
  product: ProductDetailData
  source: ProductSource
  legacyId: string
  relatedProducts: RelatedProduct[]
}

export function ProductDetailClient({
  product,
  source,
  legacyId,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabId>("reviews")
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    product.colors[0]?.id ?? null,
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes[1] ?? product.sizes[0] ?? null,
  )
  const [quantity, setQuantity] = useState(1)

  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0

  const selectedColor = product.colors.find((c) => c.id === selectedColorId)
  const colorLabel = selectedColor?.label ?? product.colors[0]?.label ?? "—"
  const sizeForCart = selectedSize ?? product.sizes[0] ?? ""
  const currentImages = selectedColorId
    ? (product.imagesByColor?.[selectedColorId] ?? product.images)
    : product.images
  const mainImage =
    currentImages[activeImage] ?? currentImages[0] ?? product.imageUrl

  const handleAddToCart = () => {
    const colorId = selectedColorId ?? product.colors[0]?.id ?? "default"
    addItem({
      productId: legacyId,
      source,
      name: product.name,
      imageUrl: mainImage,
      unitPrice: product.price,
      size: sizeForCart,
      colorLabel,
      colorId,
      quantity,
    })
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <nav
          className="mb-8 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <span className="hover:text-foreground">Shop</span>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <span className="hover:text-foreground">Men</span>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <span className="text-foreground">T-shirts</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-row gap-3 sm:flex-col sm:gap-3">
              {currentImages.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition-colors md:h-24 md:w-24",
                    activeImage === i
                      ? "border-foreground"
                      : "border-transparent hover:border-border",
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="min-h-[320px] flex-1 overflow-hidden rounded-2xl bg-muted sm:min-h-[420px]">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-contain p-6 md:p-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <StarRating rating={product.rating} />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge className="bg-red-100 text-red-500 hover:bg-red-100">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {product.description}
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Select Colors
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => {
                  const selected = selectedColorId === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      title={c.label}
                      onClick={() => {
                        setSelectedColorId(c.id)
                        setActiveImage(0)
                      }}
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full border-2 transition-shadow",
                        selected
                          ? "border-foreground ring-2 ring-ring ring-offset-2"
                          : "border-border hover:border-foreground/40",
                      )}
                      aria-label={`Color ${c.label}`}
                      aria-pressed={selected}
                    >
                      <span
                        className="size-8 rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Choose Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const selected = selectedSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-13 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-muted text-foreground hover:bg-muted/80",
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex h-11 items-center justify-between gap-4 rounded-full bg-muted px-4 text-sm font-medium">
                <button
                  type="button"
                  className="text-lg"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-6 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="text-lg"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <Button
                type="button"
                className="h-11 flex-1 rounded-full px-8 text-sm font-semibold sm:max-w-md"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 border-b border-border">
          <div className="flex flex-wrap gap-6 md:gap-10">
            {(
              [
                ["details", "Product Details"],
                ["reviews", "Rating & Reviews"],
                ["faqs", "FAQs"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors md:text-base",
                  activeTab === id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 min-h-[200px]">
          {activeTab === "details" && (
            <div className="max-w-3xl space-y-4 text-sm text-muted-foreground md:text-base">
              <p>{product.description}</p>
              <ul className="list-inside list-disc space-y-2">
                {product.detailBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold">
                  All Reviews ({product.reviews.length})
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Filter reviews"
                  >
                    <Filter className="size-4" />
                  </Button>
                  <select
                    className="h-9 rounded-full border border-border bg-background px-3 text-sm"
                    aria-label="Sort reviews"
                    defaultValue="latest"
                  >
                    <option value="latest">Latest</option>
                    <option value="highest">Highest rated</option>
                  </select>
                  <Button className="rounded-full px-5">Write a Review</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {product.reviews.map((r) => (
                  <article
                    key={r.id}
                    className="relative rounded-2xl border border-border bg-background p-5 shadow-sm"
                  >
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                      aria-label="More options"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                    <StarRating rating={r.rating} />
                    <p className="mt-2 flex items-center gap-2 font-semibold text-foreground">
                      {r.author}
                      {r.verified && (
                        <span className="text-xs font-medium text-green-600">
                          ✓ Verified
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Posted on {r.date}
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="rounded-full px-10">
                  Load More Reviews
                </Button>
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="max-w-3xl space-y-6">
              {product.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border-b border-border pb-4 last:border-0"
                >
                  <h4 className="font-semibold text-foreground">
                    {faq.question}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="mt-20">
          <h2 className="text-center text-3xl font-black uppercase tracking-tight md:text-4xl">
            You might also like
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={`${p.source}-${p.id}`}
                product={p}
                href={productDetailPath(p.source, p.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
