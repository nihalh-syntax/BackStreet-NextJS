import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProductDetailClient } from "@/components/ProductDetailClient"
import { Button } from "@/components/ui/button"
import {
  getProductByCategoryAndLegacyId,
  getRelatedProducts,
  isProductSource,
} from "@/lib/data/products"
import { pageTitle } from "@/lib/metadata"

type ProductPageProps = {
  params: Promise<{ source: string; id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { source, id } = await params
  if (!isProductSource(source)) {
    return { title: pageTitle("Product") }
  }

  const product = await getProductByCategoryAndLegacyId(source, id)
  return {
    title: pageTitle(product?.name ?? "Product"),
    description: product?.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { source, id } = await params

  if (!isProductSource(source)) {
    notFound()
  }

  const [product, relatedProducts] = await Promise.all([
    getProductByCategoryAndLegacyId(source, id),
    getRelatedProducts(source, id),
  ])

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  return (
    <ProductDetailClient
      key={`${source}-${id}`}
      product={product}
      source={source}
      legacyId={id}
      relatedProducts={relatedProducts}
    />
  )
}
