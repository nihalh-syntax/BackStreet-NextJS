import type { ProductItem } from "@/components/ProductCard"

export type ProductSource = "newArrivals" | "topSelling"

export type ProductColor = {
  id: string
  label: string
  hex: string
}

export type ProductReview = {
  id: string
  author: string
  verified: boolean
  rating: number
  text: string
  date: string
}

export type ProductFAQ = {
  question: string
  answer: string
}

export type ProductDetailData = ProductItem & {
  images: string[]
  imagesByColor?: Record<string, string[]>
  description: string
  colors: ProductColor[]
  sizes: string[]
  reviews: ProductReview[]
  faqs: ProductFAQ[]
  detailBullets: string[]
}

const DEFAULT_COLORS: ProductColor[] = [
  { id: "c1", label: "Olive", hex: "#5c6b4a" },
  { id: "c2", label: "Navy", hex: "#1e3a5f" },
  { id: "c3", label: "Black", hex: "#111111" },
  { id: "c4", label: "White", hex: "#f4f4f5" },
  { id: "c5", label: "Brown", hex: "#6b4423" },
]

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"] as const

function inferProductKeyword(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes("jeans")) return "jeans"
  if (lower.includes("shirt")) return "shirt"
  if (lower.includes("short")) return "shorts"
  return "tshirt"
}

function makeColorImages(keyword: string, color: string) {
  const c = color.toLowerCase()

  const byKeyword: Record<string, string[]> = {
    tshirt: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c564c113?auto=format&fit=crop&w=900&q=80",
    ],
    shirt: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    ],
    jeans: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80",
    ],
    shorts: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
    ],
  }

  const base = byKeyword[keyword] ?? byKeyword.tshirt
  if (c.includes("white")) return base
  if (c.includes("black")) return [...base].reverse()
  if (c.includes("navy")) return [base[1]!, base[0]!, base[2]!]
  if (c.includes("brown")) return [base[2]!, base[0]!, base[1]!]
  return [base[0]!, base[2]!, base[1]!]
}

function buildImagesByColor(item: ProductItem, colors: ProductColor[]) {
  const keyword = inferProductKeyword(item.name)
  const out: Record<string, string[]> = {}

  colors.forEach((c) => {
    out[c.id] = makeColorImages(keyword, c.label)
  })

  return out
}

const SAMPLE_REVIEWS: ProductReview[] = [
  {
    id: "r1",
    author: "Samantha D.",
    verified: true,
    rating: 5,
    text: "Absolutely love this piece! The quality is outstanding and it fits perfectly. Highly recommend!",
    date: "August 14, 2023",
  },
  {
    id: "r2",
    author: "Alex M.",
    verified: true,
    rating: 4,
    text: "Great style and comfortable fabric. Shipping was quick. Would buy again.",
    date: "August 10, 2023",
  },
  {
    id: "r3",
    author: "Jordan K.",
    verified: false,
    rating: 5,
    text: "Perfect for everyday wear. True to size.",
    date: "August 5, 2023",
  },
  {
    id: "r4",
    author: "Taylor R.",
    verified: true,
    rating: 4.5,
    text: "Nice quality and looks exactly like the photos. Very happy with my purchase.",
    date: "July 28, 2023",
  },
]

const SAMPLE_FAQS: ProductFAQ[] = [
  {
    question: "What is your return policy?",
    answer:
      "You may return unworn items within 30 days of delivery for a full refund. Tags must be attached.",
  },
  {
    question: "How do I care for this item?",
    answer:
      "Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low if needed.",
  },
  {
    question: "Is this true to size?",
    answer:
      "Yes — most customers find our fit consistent with standard US sizing. Check the size guide for measurements.",
  },
]

export const NEW_ARRIVALS_FALLBACK: ProductItem[] = [
  {
    id: "fallback-1",
    name: "T-shirt with Tape Details",
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
    rating: 4.5,
    price: 20,
  },
  {
    id: "fallback-2",
    name: "Floral Patchwork Maxi Dress",
    imageUrl: "/products/floral-dress-front.png",
    rating: 4.5,
    price: 140,
  },
  {
    id: "fallback-3",
    name: "Checkered Shirt",
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    rating: 4.5,
    price: 80,
  },
  {
    id: "fallback-4",
    name: "Essential Crew Neck T-Shirt",
    imageUrl: "/products/white-tee-front.png",
    rating: 4.5,
    price: 25,
  },
]

export const TOP_SELLING_FALLBACK: ProductItem[] = [
  {
    id: "top-fallback-1",
    name: "Vertical Striped Shirt",
    imageUrl:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=700&q=80",
    rating: 5.0,
    price: 100,
    originalPrice: 140,
  },
  {
    id: "top-fallback-2",
    name: "Palm Tree Embroidered Shirt",
    imageUrl: "/products/palm-shirt-front.png",
    rating: 4.5,
    price: 45,
  },
  {
    id: "top-fallback-3",
    name: "Gymshark Fitness Tank Top",
    imageUrl: "/products/gym-tank-front.png",
    rating: 4.5,
    price: 30,
  },
  {
    id: "top-fallback-4",
    name: "Faded Skinny Jeans",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    rating: 4.5,
    price: 75,
  },
  {
    id: "top-fallback-5",
    name: "Hosstile Bodybuilder Tee",
    imageUrl: "/products/hosstile-tee-front.png",
    rating: 5.0,
    price: 35,
  },
]

export function findFallbackProduct(
  source: ProductSource,
  id: string,
): ProductItem | null {
  const list =
    source === "newArrivals" ? NEW_ARRIVALS_FALLBACK : TOP_SELLING_FALLBACK
  return list.find((p) => p.id === id) ?? null
}

const PALM_SHIRT_IMAGES = [
  "/products/palm-shirt-front.png",
  "/products/palm-shirt-model.png",
  "/products/palm-shirt-detail.png",
]

const FLORAL_DRESS_IMAGES = [
  "/products/floral-dress-front.png",
  "/products/floral-dress-detail.png",
  "/products/floral-dress-back.png",
]

const GYM_TANK_IMAGES = [
  "/products/gym-tank-front.png",
  "/products/gym-tank-action.png",
]

const HOSSTILE_TEE_IMAGES = [
  "/products/hosstile-tee-front.png",
  "/products/hosstile-tee-back.png",
  "/products/hosstile-tee-lifestyle.png",
]

const WHITE_TEE_IMAGES = [
  "/products/white-tee-front.png",
  "/products/white-tee-standing.png",
  "/products/white-tee-detail.png",
]

/**
 * Hand-authored detail for products that use real article imagery instead of
 * the generated Unsplash placeholders. Keyed by product id.
 */
const CUSTOM_DETAILS: Record<string, ProductDetailData> = {
  "top-fallback-2": {
    id: "top-fallback-2",
    name: "Palm Tree Embroidered Shirt",
    imageUrl: "/products/palm-shirt-front.png",
    rating: 4.5,
    price: 45,
    images: PALM_SHIRT_IMAGES,
    imagesByColor: { navy: PALM_SHIRT_IMAGES },
    description:
      "A breezy revere-collar short-sleeve shirt cut from textured pure cotton, finished with a striking palm tree embroidery across the front. The tonal patchwork weave adds quiet depth while staying effortless to style — an easy statement piece for warm evenings and party season.",
    colors: [{ id: "navy", label: "Navy", hex: "#1f2433" }],
    sizes: [...DEFAULT_SIZES],
    reviews: SAMPLE_REVIEWS,
    faqs: SAMPLE_FAQS,
    detailBullets: [
      "Pure cotton with a textured patchwork weave",
      "Hand-finished palm tree embroidery across the front",
      "Revere (Cuban) collar with a relaxed short-sleeve fit",
      "Chest patch pocket and button-through front",
    ],
  },
  "fallback-2": {
    id: "fallback-2",
    name: "Floral Patchwork Maxi Dress",
    imageUrl: "/products/floral-dress-front.png",
    rating: 4.5,
    price: 140,
    images: FLORAL_DRESS_IMAGES,
    imagesByColor: { ivory: FLORAL_DRESS_IMAGES },
    description:
      "A flowing tiered maxi dress in a vivid floral patchwork print, cut from lightweight cotton. Flutter sleeves and a V-neckline sit above an elasticated waist that falls into a sweeping tiered skirt — a romantic, head-turning piece made for warm-weather celebrations.",
    colors: [{ id: "ivory", label: "Ivory Multi", hex: "#efe6d6" }],
    sizes: [...DEFAULT_SIZES],
    reviews: SAMPLE_REVIEWS,
    faqs: SAMPLE_FAQS,
    detailBullets: [
      "Lightweight cotton with an all-over floral patchwork print",
      "Flutter short sleeves and a flattering V-neckline",
      "Elasticated waist with a tiered maxi skirt",
      "Pull-on style with convenient side pockets",
    ],
  },
  "top-fallback-3": {
    id: "top-fallback-3",
    name: "Gymshark Fitness Tank Top",
    imageUrl: "/products/gym-tank-front.png",
    rating: 4.5,
    price: 30,
    images: GYM_TANK_IMAGES,
    imagesByColor: { black: GYM_TANK_IMAGES },
    description:
      "A training-ready tank cut for heavy lifting days, with dropped armholes for an unrestricted range of motion and a lightweight, sweat-wicking fabric that keeps you cool through every set. Finished with the signature Gymshark Fitness print for that classic gym-floor look.",
    colors: [{ id: "black", label: "Black", hex: "#111111" }],
    sizes: [...DEFAULT_SIZES],
    reviews: SAMPLE_REVIEWS,
    faqs: SAMPLE_FAQS,
    detailBullets: [
      "Lightweight, breathable fabric built for training",
      "Dropped armholes for a full range of motion",
      "Sweat-wicking with a relaxed gym fit",
      "Signature Gymshark Fitness chest print",
    ],
  },
  "top-fallback-5": {
    id: "top-fallback-5",
    name: "Hosstile Bodybuilder Tee",
    imageUrl: "/products/hosstile-tee-front.png",
    rating: 5.0,
    price: 35,
    images: HOSSTILE_TEE_IMAGES,
    imagesByColor: { oxblood: HOSSTILE_TEE_IMAGES },
    description:
      "A heavyweight cotton training tee built for the bodybuilder grind. Featuring the Hosstile 'Forever Bodybuilder — No Sacrifice, No Reward' shield print front and back, it pairs an oversized gym-ready cut with soft, durable fabric that holds up set after set.",
    colors: [{ id: "oxblood", label: "Oxblood", hex: "#5b4038" }],
    sizes: [...DEFAULT_SIZES],
    reviews: SAMPLE_REVIEWS,
    faqs: SAMPLE_FAQS,
    detailBullets: [
      "Heavyweight 100% cotton for durability",
      "Oversized, gym-ready relaxed fit",
      "Bold Hosstile shield print front and back",
      "Ribbed crew neck that keeps its shape",
    ],
  },
  "fallback-4": {
    id: "fallback-4",
    name: "Essential Crew Neck T-Shirt",
    imageUrl: "/products/white-tee-front.png",
    rating: 4.5,
    price: 25,
    images: WHITE_TEE_IMAGES,
    imagesByColor: { white: WHITE_TEE_IMAGES },
    description:
      "The everyday staple done right — a clean crew-neck tee in soft, breathable combed cotton with just the right amount of stretch. Its regular fit and clean finish make it the perfect base layer or stand-alone piece for any look.",
    colors: [{ id: "white", label: "White", hex: "#f4f4f5" }],
    sizes: [...DEFAULT_SIZES],
    reviews: SAMPLE_REVIEWS,
    faqs: SAMPLE_FAQS,
    detailBullets: [
      "Soft, breathable combed cotton with a touch of stretch",
      "Classic crew neckline that holds its shape",
      "Regular fit that layers easily",
      "Pre-shrunk and machine washable",
    ],
  },
}

export function buildProductDetail(item: ProductItem): ProductDetailData {
  const custom = CUSTOM_DETAILS[item.id]
  if (custom) {
    return custom
  }

  const img2 =
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
  const img3 =
    "https://images.unsplash.com/photo-1618354691373-d851c564c113?auto=format&fit=crop&w=800&q=80"
  const colors = [...DEFAULT_COLORS]
  const imagesByColor = buildImagesByColor(item, colors)
  const firstColorImages = imagesByColor[colors[0]!.id] ?? [item.imageUrl, img2, img3]

  return {
    ...item,
    images: firstColorImages.slice(0, 3),
    imagesByColor,
    description:
      "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style. The vibrant graphic adds a touch of personality. Ideal for layering or wearing solo — durable stitching and a relaxed fit you will reach for again and again.",
    colors,
    sizes: [...DEFAULT_SIZES],
    reviews: SAMPLE_REVIEWS,
    faqs: SAMPLE_FAQS,
    detailBullets: [
      "Premium cotton blend for breathability and comfort",
      "Reinforced seams for everyday durability",
      "Machine washable — retains shape after washing",
      "Designed for a relaxed, modern fit",
    ],
  }
}
