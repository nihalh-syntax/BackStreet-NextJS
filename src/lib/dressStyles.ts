export const DRESS_STYLE_IDS = ["casual", "formal", "party", "gym"] as const

export type DressStyleId = (typeof DRESS_STYLE_IDS)[number]

export type DressStyle = {
  id: DressStyleId
  title: string
  /** Short banner subtitle. */
  tagline: string
  /** Longer intro paragraph for the category page. */
  description: string
  imageUrl: string
  /** Grid column span used by the home "Browse by Dress Style" section. */
  className?: string
  /** Card height used by the home section. */
  cardHeightClass?: string
  /** Image object-position tweaks. */
  imageClassName?: string
}

export const DRESS_STYLES: DressStyle[] = [
  {
    id: "casual",
    title: "Casual",
    tagline: "Easy, everyday essentials",
    description:
      "Relaxed staples built for everyday comfort — soft tees, easy denim, and laid-back layers you can throw on and go.",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-2",
    cardHeightClass: "h-52 md:h-56",
  },
  {
    id: "formal",
    title: "Formal",
    tagline: "Sharp tailoring for the occasion",
    description:
      "Refined pieces for the moments that matter — crisp shirts and tailored silhouettes that keep you looking polished.",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    className: "md:col-span-3",
    cardHeightClass: "h-52 md:h-56",
    imageClassName: "object-top",
  },
  {
    id: "party",
    title: "Party",
    tagline: "Statement looks after dark",
    description:
      "Turn-heads pieces with bold energy — standout prints and night-ready fits made to be noticed.",
    imageUrl:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80",
    className: "md:col-span-3",
    cardHeightClass: "h-56 md:h-64",
  },
  {
    id: "gym",
    title: "Gym",
    tagline: "Performance-ready activewear",
    description:
      "Move-with-you gear engineered for the grind — breathable, durable fits that keep up through every rep.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-2",
    cardHeightClass: "h-56 md:h-64",
    imageClassName: "object-top",
  },
]

export function getDressStyle(id: string): DressStyle | undefined {
  return DRESS_STYLES.find((style) => style.id === id)
}

export function isDressStyleId(value: string): value is DressStyleId {
  return (DRESS_STYLE_IDS as readonly string[]).includes(value)
}
