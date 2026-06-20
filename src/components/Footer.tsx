import Link from "next/link"
import { Facebook, Github, Instagram } from "lucide-react"

import { FooterNewsletter } from "@/components/FooterNewsletter"

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Features", href: "#" },
  { label: "Works", href: "#" },
  { label: "Career", href: "#" },
]

const helpLinks = [
  { label: "Customer Support", href: "#" },
  { label: "Delivery Details", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

const faqLinks = [
  { label: "Account", href: "#" },
  { label: "Manage Deliveries", href: "#" },
  { label: "Orders", href: "#" },
  { label: "Payments", href: "#" },
]

const resourceLinks = [
  { label: "Free eBooks", href: "#" },
  { label: "Development Tutorial", href: "#" },
  { label: "How to — Blog", href: "#" },
  { label: "Youtube Playlist", href: "#" },
]

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-muted/50 text-foreground">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <FooterNewsletter />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 md:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-foreground"
            >
              BackStreet
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We have clothes that suits your style and which you&apos;re proud
              to wear. From women to men.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="X"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
                aria-label="Facebook"
              >
                <Facebook className="size-4" strokeWidth={1.75} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="Instagram"
              >
                <Instagram className="size-4" strokeWidth={1.75} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="GitHub"
              >
                <Github className="size-4" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Help
            </h3>
            <ul className="mt-4 space-y-3">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              FAQ
            </h3>
            <ul className="mt-4 space-y-3">
              {faqLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            BackStreet © 2024–2026, All Rights Reserved
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map(
              (name) => (
                <span
                  key={name}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-sm"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
