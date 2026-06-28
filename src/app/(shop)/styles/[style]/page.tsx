import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import ProductGrid from "@/components/ProductGrid"
import { getProductsForDressStyle } from "@/lib/data/products"
import {
  DRESS_STYLES,
  getDressStyle,
  isDressStyleId,
} from "@/lib/dressStyles"
import { pageTitle } from "@/lib/metadata"

type StylePageProps = {
  params: Promise<{ style: string }>
}

export function generateStaticParams() {
  return DRESS_STYLES.map((style) => ({ style: style.id }))
}

export async function generateMetadata({
  params,
}: StylePageProps): Promise<Metadata> {
  const { style } = await params
  const dressStyle = getDressStyle(style)
  if (!dressStyle) {
    return { title: pageTitle("Dress Style") }
  }
  return {
    title: pageTitle(`${dressStyle.title} Style`),
    description: dressStyle.description,
  }
}

export default async function DressStylePage({ params }: StylePageProps) {
  const { style } = await params

  if (!isDressStyleId(style)) {
    notFound()
  }

  const dressStyle = getDressStyle(style)!
  const { primary, more } = await getProductsForDressStyle(style)

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <nav
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <Link href="/#browse-by-style" className="hover:text-foreground">
            Dress Style
          </Link>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
          <span className="text-foreground">{dressStyle.title}</span>
        </nav>

        <div className="relative overflow-hidden rounded-3xl bg-muted">
          <img
            src={dressStyle.imageUrl}
            alt={`${dressStyle.title} dress style`}
            className={`h-60 w-full object-cover md:h-80 ${dressStyle.imageClassName ?? ""}`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              {dressStyle.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-white/80 md:text-base">
              {dressStyle.tagline}
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
          {dressStyle.description}
        </p>

        {primary.length > 0 && (
          <div className="mt-10">
            <ProductGrid products={primary} />
          </div>
        )}

        {more.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              More to explore
            </h2>
            <ProductGrid className="mt-6" products={more} />
          </section>
        )}

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
            Browse other styles
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {DRESS_STYLES.filter((other) => other.id !== style).map((other) => (
              <Link
                key={other.id}
                href={`/styles/${other.id}`}
                className="rounded-full border border-border bg-muted px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {other.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
