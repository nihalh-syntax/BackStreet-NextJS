"use client"

import { Search, ShoppingCart, User } from "lucide-react"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"

import ModeToggle from "./ModeToggle"
import { useCart } from "@/context/CartContext"

const navLinkClass =
  "text-foreground hover:text-foreground/90 transition-colors text-sm font-medium whitespace-nowrap"

const SECTION_IDS = {
  shop: "shop",
  newArrivals: "new-arrivals",
  topSelling: "top-selling",
  browseByStyle: "browse-by-style",
} as const

const NavBar = () => {
  const { isSignedIn } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()

  const goToHomeSection =
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      router.push(`/#${sectionId}`)
    }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 md:gap-8 md:px-6">
        <div className="flex shrink-0 items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground md:text-xl"
          >
            BackStreet
          </Link>
          <nav
            className="ml-10 hidden items-center gap-5 text-sm sm:flex md:gap-6"
            aria-label="Main"
          >
            <a
              href={`/#${SECTION_IDS.shop}`}
              onClick={goToHomeSection(SECTION_IDS.shop)}
              className={navLinkClass}
            >
              Shop
            </a>
            <a
              href={`/#${SECTION_IDS.newArrivals}`}
              onClick={goToHomeSection(SECTION_IDS.newArrivals)}
              className={navLinkClass}
            >
              New Arrivals
            </a>
            <a
              href={`/#${SECTION_IDS.topSelling}`}
              onClick={goToHomeSection(SECTION_IDS.topSelling)}
              className={navLinkClass}
            >
              Top Selling
            </a>
            <a
              href={`/#${SECTION_IDS.browseByStyle}`}
              onClick={goToHomeSection(SECTION_IDS.browseByStyle)}
              className={navLinkClass}
            >
              Browse by Style
            </a>
          </nav>
        </div>

        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search for products..."
            className="h-10 w-full rounded-full border-0 bg-muted py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Search for products"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <ModeToggle />
          <Link
            href="/cart"
            className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="size-5" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold leading-none text-background">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {isSignedIn ? (
            <div className="inline-flex size-10 items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted/80"
                aria-label="Sign in"
              >
                <User className="size-5" strokeWidth={1.75} />
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
