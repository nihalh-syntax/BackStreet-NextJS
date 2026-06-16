import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { ChevronRight, Filter, MoreVertical } from "lucide-react"

import { db } from "../../firebase/config"
import ProductCard, { type ProductItem } from "@/components/ProductCard"
import StarRating from "@/components/ui/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  type ProductDetailData,
  type ProductSource,
  buildProductDetail,
  findFallbackProduct,
  NEW_ARRIVALS_FALLBACK,
  TOP_SELLING_FALLBACK,
} from "@/data/productCatalog"
import { useCart } from "@/context/CartContext"

type TabId = "details" | "reviews" | "faqs"

type FirestoreProduct = {
  name?: string
  imageUrl?: string
  image?: string
  rating?: number
  price?: number
  originalPrice?: number
  description?: string
  images?: string[]
  colors?: { id?: string; label?: string; hex?: string }[]
  colorImages?: Record<string, string[]>
  sizes?: string[]
}

function isProductSource(value: string | undefined): value is ProductSource {
  return value === "newArrivals" || value === "topSelling"
}

const ProductPage = () => {
  const { addItem } = useCart()
  const { source: sourceParam, id: idParam } = useParams<{
    source: string
    id: string
  }>()

  const [product, setProduct] = useState<ProductDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabId>("reviews")
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const loadProduct = useCallback(async () => {
    if (!idParam || !isProductSource(sourceParam)) {
      setProduct(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const collectionName =
        sourceParam === "newArrivals" ? "newArrivals" : "topSelling"
      const snap = await getDoc(doc(db, collectionName, idParam))

      if (snap.exists()) {
        const data = snap.data() as FirestoreProduct
        const imageUrl = data.imageUrl ?? data.image
        if (data.name && imageUrl && typeof data.price === "number") {
          const base: ProductItem = {
            id: snap.id,
            name: data.name,
            imageUrl,
            rating: typeof data.rating === "number" ? data.rating : 4,
            price: data.price,
            originalPrice:
              typeof data.originalPrice === "number"
                ? data.originalPrice
                : undefined,
          }
          const detail = buildProductDetail(base)
          if (Array.isArray(data.images) && data.images.length > 0) {
            detail.images = data.images.slice(0, 5)
          }
          if (typeof data.description === "string" && data.description.trim()) {
            detail.description = data.description
          }
          if (Array.isArray(data.colors) && data.colors.length > 0) {
            const mapped = data.colors
              .slice(0, 5)
              .map((c, i) => ({
                id: c.id ?? `c-${i}`,
                label: c.label ?? `Color ${i + 1}`,
                hex: c.hex ?? "#888888",
              }))
            detail.colors = mapped
            if (data.colorImages && typeof data.colorImages === "object") {
              const byColor: Record<string, string[]> = {}
              mapped.forEach((color) => {
                const candidates = data.colorImages?.[color.id]
                if (Array.isArray(candidates) && candidates.length > 0) {
                  byColor[color.id] = candidates.slice(0, 3)
                }
              })
              if (Object.keys(byColor).length > 0) {
                detail.imagesByColor = byColor
                const firstSet = byColor[mapped[0]!.id]
                if (firstSet && firstSet.length > 0) {
                  detail.images = firstSet
                }
              }
            }
          }
          if (Array.isArray(data.sizes) && data.sizes.length > 0) {
            detail.sizes = data.sizes.slice(0, 5)
          }
          setProduct(detail)
          setSelectedColorId(detail.colors[0]?.id ?? null)
          setSelectedSize(detail.sizes[1] ?? detail.sizes[0] ?? null)
          setActiveImage(0)
          return
        }
      }

      const fallback = findFallbackProduct(sourceParam, idParam)
      if (fallback) {
        const detail = buildProductDetail(fallback)
        setProduct(detail)
        setSelectedColorId(detail.colors[0]?.id ?? null)
        setSelectedSize(detail.sizes[1] ?? detail.sizes[0] ?? null)
        setActiveImage(0)
        return
      }

      setProduct(null)
    } catch (e) {
      console.error(e)
      const fallback = findFallbackProduct(
        sourceParam as ProductSource,
        idParam,
      )
      if (fallback) {
        const detail = buildProductDetail(fallback)
        setProduct(detail)
        setSelectedColorId(detail.colors[0]?.id ?? null)
        setSelectedSize(detail.sizes[1] ?? detail.sizes[0] ?? null)
      } else {
        setProduct(null)
      }
    } finally {
      setLoading(false)
    }
  }, [idParam, sourceParam])

  useEffect(() => {
    void loadProduct()
  }, [loadProduct])

  const youMightAlsoLike = useMemo(() => {
    const pool = [
      ...NEW_ARRIVALS_FALLBACK.map((p) => ({ ...p, source: "newArrivals" as const })),
      ...TOP_SELLING_FALLBACK.map((p) => ({ ...p, source: "topSelling" as const })),
    ].filter((p) => !(p.id === idParam && p.source === sourceParam))
    return pool.slice(0, 4)
  }, [idParam, sourceParam])

  if (!isProductSource(sourceParam) || !idParam) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Invalid product link.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">
        Loading product…
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) * 100,
      )
    : 0

  const selectedColor = product.colors.find((c) => c.id === selectedColorId)
  const colorLabel = selectedColor?.label ?? product.colors[0]?.label ?? "—"
  const sizeForCart = selectedSize ?? product.sizes[0] ?? ""
  const currentImages = selectedColorId
    ? product.imagesByColor?.[selectedColorId] ?? product.images
    : product.images
  const mainImage = currentImages[activeImage] ?? currentImages[0] ?? product.imageUrl

  const handleAddToCart = () => {
    if (!isProductSource(sourceParam) || !idParam) return
    const colorId = selectedColorId ?? product.colors[0]?.id ?? "default"
    addItem({
      productId: idParam,
      source: sourceParam,
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
          <Link to="/" className="hover:text-foreground">
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
                  <Button variant="outline" size="icon-sm" aria-label="Filter reviews">
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
                <div key={i} className="border-b border-border pb-4 last:border-0">
                  <h4 className="font-semibold text-foreground">{faq.question}</h4>
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
            {youMightAlsoLike.map((p) => (
              <ProductCard
                key={`${p.source}-${p.id}`}
                product={p}
                href={`/product/${p.source}/${encodeURIComponent(p.id)}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductPage
