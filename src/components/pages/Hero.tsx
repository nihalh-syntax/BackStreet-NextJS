// Hero Page is the main page of the website

"use client"

import { useId, useState } from "react"
import { Button } from "../ui/button"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1619789332426-00fc137633d1?auto=format&fit=crop&w=800&q=80"

/** Single outline path — inner clip uses the same path scaled from center for even inset. */
const FRAME_PATH =
  "M52 96C28 188 18 292 42 384C66 476 148 508 246 502C344 496 398 448 412 356C426 264 408 172 372 92C336 12 248 -8 156 8C64 24 76 4 52 96Z"

const VIEW_W = 420
const VIEW_H = 520
const CX = VIEW_W / 2
const CY = VIEW_H / 2
/** ~6% inset on all sides between stroke and photo (uniform scale from center). */
const INNER_SCALE = 0.88

type BrandEntry = {
  name: string
  /**
   * Simple Icons CDN slug (https://cdn.simpleicons.org/{slug}/ffffff).
   * Omit when there is no icon — only the wordmark is shown.
   */
  iconSlug?: string
  fontClass: string
  /** If false, keep name casing (e.g. Calvin Klein). */
  uppercase?: boolean
  /** Show only the SVG mark, no label (name still in sr-only summary). */
  logoOnly?: boolean
  /** Flag + wordmark (no Simple Icons slug). */
  tommy?: boolean
  /** Croc mark + wordmark (no Simple Icons slug). */
  lacoste?: boolean
}

const BRANDS: BrandEntry[] = [
  { name: "VERSACE", fontClass: "font-brand-luxury" },
  {
    name: "ZARA",
    iconSlug: "zara",
    fontClass: "font-brand-condensed",
    logoOnly: true,
  },
  { name: "GUCCI", fontClass: "font-brand-luxury" },
  { name: "PRADA", fontClass: "font-brand-luxury" },
  {
    name: "Calvin Klein",
    fontClass: "font-brand-calvin",
    uppercase: false,
  },
  {
    name: "Tommy Hilfiger",
    fontClass: "",
    tommy: true,
  },
  {
    name: "Lacoste",
    fontClass: "",
    lacoste: true,
  },
  {
    name: "H&M",
    iconSlug: "handm",
    fontClass: "font-brand-clean text-sm md:text-base",
    uppercase: false,
    logoOnly: true,
  },
  { name: "NIKE", iconSlug: "nike", fontClass: "font-brand-sport" },
  { name: "ADIDAS", iconSlug: "adidas", fontClass: "font-brand-sport-alt" },
  { name: "PUMA", iconSlug: "puma", fontClass: "font-brand-sport-alt" },
  {
    name: "FILA",
    iconSlug: "fila",
    fontClass: "font-brand-condensed",
    logoOnly: true,
  },
  {
    name: "NEW BALANCE",
    iconSlug: "newbalance",
    fontClass: "font-brand-clean text-sm md:text-base",
  },
  { name: "ASICS", fontClass: "font-brand-condensed" },
  { name: "Reebok", iconSlug: "reebok", fontClass: "font-brand-condensed" },
]

function brandIconUrl(slug: string) {
  return `https://cdn.simpleicons.org/${slug}/ffffff`
}

/**
 * Retail-style flag: thin gray top/bottom bars; center band split white | red.
 */
function TommyHilfigerFlagIcon() {
  return (
    <svg
      viewBox="0 0 64 32"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-14 shrink-0 md:h-8 md:w-16"
      aria-hidden
    >
      <rect width="64" height="4" fill="#d1d5db" />
      <rect y="4" width="32" height="24" fill="#ffffff" />
      <rect x="32" y="4" width="32" height="24" fill="#e31837" />
      <rect y="28" width="64" height="4" fill="#d1d5db" />
    </svg>
  )
}

/** TOMMY — flag — HILFIGER (single baseline, uppercase geometric sans). */
function TommyHilfigerLockup() {
  return (
    <span className="flex shrink-0 items-center gap-3 whitespace-nowrap md:gap-4">
      <span className="font-brand-tommy-wordmark">TOMMY</span>
      <TommyHilfigerFlagIcon />
      <span className="font-brand-tommy-wordmark">HILFIGER</span>
    </span>
  )
}

/** Classic croc mark (white on dark green) — reference asset in `public/lacoste-croc.png`. */
function LacosteCrocIcon() {
  return (
    <img
      src="/lacoste-croc.png"
      alt=""
      width={96}
      height={36}
      className="h-7 w-auto max-h-9 shrink-0 rounded-sm object-contain shadow-none md:h-8"
      loading="lazy"
      decoding="async"
    />
  )
}

function LacosteLockup() {
  return (
    <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-white md:gap-3">
      <LacosteCrocIcon />
      <span className="font-brand-lacoste text-base md:text-lg">Lacoste</span>
    </span>
  )
}

function BrandLogo({
  iconSlug,
  logoOnly,
}: {
  iconSlug?: string
  logoOnly?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (!iconSlug || failed) {
    return null
  }
  return (
    <img
      src={brandIconUrl(iconSlug)}
      alt=""
      width={logoOnly ? 120 : 28}
      height={logoOnly ? 40 : 28}
      className={
        logoOnly
          ? "h-8 w-auto max-h-9 max-w-30 shrink-0 object-contain object-left md:h-10 md:max-h-11 md:max-w-34"
          : "size-6 shrink-0 object-contain md:size-7"
      }
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function BrandMarquee() {
  const track = [...BRANDS, ...BRANDS]

  return (
    <div className="w-full overflow-hidden bg-black py-3 md:py-4">
      <p className="sr-only">
        Featured brands: {BRANDS.map((b) => b.name).join(", ")}.
      </p>
      <div
        className="hero-brand-marquee flex w-max gap-x-10 md:gap-x-16"
        aria-hidden
      >
        {track.map((brand, i) => {
          if (brand.tommy) {
            return <TommyHilfigerLockup key={`tommy-hilfiger-${i}`} />
          }
          if (brand.lacoste) {
            return <LacosteLockup key={`lacoste-${i}`} />
          }
          return (
            <span
              key={`${brand.name}-${i}`}
              className={`flex shrink-0 items-center whitespace-nowrap text-white ${
                brand.logoOnly
                  ? ""
                  : brand.iconSlug
                    ? "gap-2.5 md:gap-3"
                    : ""
              }`}
            >
              <BrandLogo iconSlug={brand.iconSlug} logoOnly={brand.logoOnly} />
              {!brand.logoOnly && (
                <span
                  className={`text-base md:text-lg ${brand.uppercase === false ? "normal-case" : "uppercase"} ${brand.fontClass}`}
                >
                  {brand.name}
                </span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function FourPointStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
    </svg>
  )
}

const Hero = () => {
  const clipId = useId().replace(/:/g, "")

  return (
    <section
      id="shop"
      className="scroll-mt-24 bg-background"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-2 pt-8 md:gap-10 md:px-6 md:pb-3 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:pb-3 lg:pt-12">
        <div className="flex flex-col gap-6 md:gap-8">
          <h1 className="max-w-xl font-sans text-[2.25rem] font-black uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
            Find clothes that matches your style
          </h1>
          <p className="max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground md:text-base">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <div>
            <Button
              asChild
              className="h-12 rounded-full bg-foreground px-10 text-[0.95rem] font-medium text-background hover:bg-foreground/90"
            >
              <a href="#new-arrivals">Shop Now</a>
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:mt-4 sm:grid-cols-3 sm:gap-0 sm:border-t-0 sm:pt-0 sm:divide-x sm:divide-border">
            <div className="flex flex-col gap-1 sm:pr-8">
              <span className="text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                200+
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                International Brands
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:px-8">
              <span className="text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                2,000+
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                High-Quality Products
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:pl-8">
              <span className="text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                30,000+
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                Happy Customers
              </span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:justify-self-end">
          <FourPointStar className="absolute -left-2 top-[18%] z-10 size-8 text-foreground md:left-0 md:size-10" />
          <FourPointStar className="absolute -right-1 -top-2 z-10 size-14 text-foreground md:right-2 md:size-18" />

          <div className="relative aspect-4/5 w-full sm:aspect-5/6">
            <svg
              className="h-full w-full text-foreground"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                  <path
                    transform={`translate(${CX} ${CY}) scale(${INNER_SCALE}) translate(${-CX} ${-CY})`}
                    d={FRAME_PATH}
                  />
                </clipPath>
              </defs>
              <image
                href={HERO_IMAGE}
                x={0}
                y={0}
                width={VIEW_W}
                height={VIEW_H}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
              />
              <path
                d={FRAME_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>

      <BrandMarquee />
    </section>
  )
}

export default Hero
