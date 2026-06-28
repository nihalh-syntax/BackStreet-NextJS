import { config } from "dotenv"
import { PrismaClient, ProductCategory, DressStyle } from "@prisma/client"

import {
  NEW_ARRIVALS_FALLBACK,
  TOP_SELLING_FALLBACK,
  buildProductDetail,
} from "../src/data/productCatalog"

/** Maps each catalog product to a dress style for the Browse-by-Style pages. */
const DRESS_STYLE_BY_ID: Record<string, DressStyle> = {
  "fallback-1": DressStyle.casual, // T-shirt with Tape Details
  "fallback-2": DressStyle.party, // Skinny Fit Jeans
  "fallback-3": DressStyle.formal, // Checkered Shirt
  "fallback-4": DressStyle.casual, // Sleeve Striped T-shirt
  "top-fallback-1": DressStyle.formal, // Vertical Striped Shirt
  "top-fallback-2": DressStyle.party, // Courage Graphic T-shirt
  "top-fallback-3": DressStyle.gym, // Loose Fit Bermuda Shorts
  "top-fallback-4": DressStyle.casual, // Faded Skinny Jeans
}

config({ path: ".env.local" })
config({ path: ".env" })

const prisma = new PrismaClient()

function slugFromId(category: ProductCategory, id: string) {
  return `${category}-${id}`
}

async function seedProducts(
  items: typeof NEW_ARRIVALS_FALLBACK,
  category: ProductCategory,
) {
  for (const item of items) {
    const detail = buildProductDetail(item)
    const dressStyle = DRESS_STYLE_BY_ID[item.id] ?? DressStyle.casual
    await prisma.product.upsert({
      where: { slug: slugFromId(category, item.id) },
      update: {
        name: detail.name,
        description: detail.description,
        price: detail.price,
        originalPrice: detail.originalPrice ?? null,
        rating: detail.rating,
        category,
        dressStyle,
        imageUrl: detail.imageUrl,
        images: detail.images,
        imagesByColor: detail.imagesByColor ?? undefined,
        colors: detail.colors,
        sizes: detail.sizes,
        reviews: detail.reviews,
        faqs: detail.faqs,
        detailBullets: detail.detailBullets,
      },
      create: {
        slug: slugFromId(category, item.id),
        name: detail.name,
        description: detail.description,
        price: detail.price,
        originalPrice: detail.originalPrice ?? null,
        rating: detail.rating,
        category,
        dressStyle,
        imageUrl: detail.imageUrl,
        images: detail.images,
        imagesByColor: detail.imagesByColor ?? undefined,
        colors: detail.colors,
        sizes: detail.sizes,
        reviews: detail.reviews,
        faqs: detail.faqs,
        detailBullets: detail.detailBullets,
      },
    })
  }
}

async function main() {
  console.log("Seeding promo codes...")
  await prisma.promoCode.upsert({
    where: { code: "SAVE10" },
    update: { discountFlat: 10, active: true },
    create: { code: "SAVE10", discountFlat: 10, active: true },
  })
  await prisma.promoCode.upsert({
    where: { code: "WELCOME" },
    update: { discountFlat: 15, active: true },
    create: { code: "WELCOME", discountFlat: 15, active: true },
  })

  console.log("Seeding new arrivals...")
  await seedProducts(NEW_ARRIVALS_FALLBACK, ProductCategory.newArrivals)

  console.log("Seeding top selling...")
  await seedProducts(TOP_SELLING_FALLBACK, ProductCategory.topSelling)

  const counts = await Promise.all([
    prisma.product.count(),
    prisma.promoCode.count(),
  ])
  console.log(`Done — ${counts[0]} products, ${counts[1]} promo codes.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
