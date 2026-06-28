import { ProductCategory, type Product } from "@prisma/client"

import type { ProductItem } from "@/components/ProductCard"
import type {
  ProductColor,
  ProductDetailData,
  ProductFAQ,
  ProductReview,
  ProductSource,
} from "@/data/productCatalog"
import { type DressStyleId } from "@/lib/dressStyles"
import { prisma } from "@/lib/prisma"

export function productSourceToCategory(source: ProductSource): ProductCategory {
  return source === "newArrivals"
    ? ProductCategory.newArrivals
    : ProductCategory.topSelling
}

export function categoryToProductSource(
  category: ProductCategory,
): ProductSource {
  return category === ProductCategory.newArrivals
    ? "newArrivals"
    : "topSelling"
}

export function slugFromLegacyId(
  category: ProductCategory,
  legacyId: string,
): string {
  return `${category}-${legacyId}`
}

export function legacyIdFromSlug(
  category: ProductCategory,
  slug: string,
): string {
  const prefix = `${category}-`
  return slug.startsWith(prefix) ? slug.slice(prefix.length) : slug
}

export function isProductSource(value: string): value is ProductSource {
  return value === "newArrivals" || value === "topSelling"
}

function decimalToNumber(value: { toNumber(): number } | number): number {
  return typeof value === "number" ? value : value.toNumber()
}

export function mapProductToItem(product: Product): ProductItem {
  return {
    id: legacyIdFromSlug(product.category, product.slug),
    name: product.name,
    imageUrl: product.imageUrl,
    rating: product.rating,
    price: decimalToNumber(product.price),
    originalPrice: product.originalPrice
      ? decimalToNumber(product.originalPrice)
      : undefined,
  }
}

export function mapProductToDetail(product: Product): ProductDetailData {
  const item = mapProductToItem(product)
  return {
    ...item,
    images: product.images as string[],
    imagesByColor:
      (product.imagesByColor as Record<string, string[]> | null) ?? undefined,
    description: product.description,
    colors: product.colors as ProductColor[],
    sizes: product.sizes as string[],
    reviews: product.reviews as ProductReview[],
    faqs: product.faqs as ProductFAQ[],
    detailBullets: product.detailBullets as string[],
  }
}

export async function getProductsByCategory(
  source: ProductSource,
  limit = 48,
): Promise<ProductItem[]> {
  const products = await prisma.product.findMany({
    where: { category: productSourceToCategory(source) },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
  return products.map(mapProductToItem)
}

export async function getProductByCategoryAndLegacyId(
  source: ProductSource,
  legacyId: string,
): Promise<ProductDetailData | null> {
  const category = productSourceToCategory(source)
  const product = await prisma.product.findUnique({
    where: { slug: slugFromLegacyId(category, legacyId) },
  })
  return product ? mapProductToDetail(product) : null
}

export async function getFeaturedProducts() {
  const [newArrivals, topSelling] = await Promise.all([
    getProductsByCategory("newArrivals", 8),
    getProductsByCategory("topSelling", 8),
  ])
  return { newArrivals, topSelling }
}

export type RelatedProduct = ProductItem & { source: ProductSource }

export async function getAllProductsWithSource(): Promise<RelatedProduct[]> {
  const [newArrivals, topSelling] = await Promise.all([
    getProductsByCategory("newArrivals", 48),
    getProductsByCategory("topSelling", 48),
  ])

  return [
    ...newArrivals.map((p) => ({ ...p, source: "newArrivals" as const })),
    ...topSelling.map((p) => ({ ...p, source: "topSelling" as const })),
  ]
}

/**
 * Splits the catalog for a dress-style page: products tagged with the style are
 * featured, the rest fall under "more to explore" so the page stays populated.
 */
export async function getProductsForDressStyle(style: DressStyleId): Promise<{
  primary: RelatedProduct[]
  more: RelatedProduct[]
}> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  const primary: RelatedProduct[] = []
  const more: RelatedProduct[] = []
  for (const product of products) {
    const mapped: RelatedProduct = {
      ...mapProductToItem(product),
      source: categoryToProductSource(product.category),
    }
    if (product.dressStyle === style) {
      primary.push(mapped)
    } else {
      more.push(mapped)
    }
  }

  return { primary, more }
}

export async function getRelatedProducts(
  source: ProductSource,
  legacyId: string,
  limit = 4,
): Promise<RelatedProduct[]> {
  const [newArrivals, topSelling] = await Promise.all([
    getProductsByCategory("newArrivals", 20),
    getProductsByCategory("topSelling", 20),
  ])

  return [
    ...newArrivals.map((p) => ({ ...p, source: "newArrivals" as const })),
    ...topSelling.map((p) => ({ ...p, source: "topSelling" as const })),
  ]
    .filter((p) => !(p.id === legacyId && p.source === source))
    .slice(0, limit)
}
