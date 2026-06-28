import Link from "next/link"

import { cn } from "@/lib/utils"
import { DRESS_STYLES, type DressStyle } from "@/lib/dressStyles"

type DressStyleCardProps = {
  style: DressStyle
}

const DressStyleCard = ({ style }: DressStyleCardProps) => {
  return (
    <Link
      href={`/styles/${style.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-muted",
        style.cardHeightClass ?? "h-52 md:h-56",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        style.className,
      )}
      aria-label={`Browse ${style.title} style`}
    >
      <img
        src={style.imageUrl}
        alt={`${style.title} clothing style`}
        loading="lazy"
        className={cn(
          "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110",
          style.imageClassName,
        )}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/15 to-transparent" />
      <span
        className={cn(
          "absolute left-5 top-4 text-3xl font-bold md:text-[2rem]",
          "text-neutral-900 dark:text-white",
          "drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]",
          "dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]",
        )}
      >
        {style.title}
      </span>
    </Link>
  )
}

const BrowseSection = () => {
  return (
    <section
      id="browse-by-style"
      className="scroll-mt-24 bg-background pb-24 md:pb-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-4xl bg-muted px-6 py-10 md:px-9 md:py-12">
          <h2 className="text-center text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
            Browse by Dress Style
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-5">
            {DRESS_STYLES.map((style) => (
              <DressStyleCard key={style.id} style={style} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrowseSection
