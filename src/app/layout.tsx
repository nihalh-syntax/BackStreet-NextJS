import type { Metadata } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"

import { Providers } from "@/components/providers"
import { APP_THEME_STORAGE_KEY } from "@/theme/constants"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "BackStreet",
    template: "%s | BackStreet",
  },
  description: "Premium streetwear and fashion.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function () {
  var k = ${JSON.stringify(APP_THEME_STORAGE_KEY)};
  try {
    var v = localStorage.getItem(k);
    var root = document.documentElement;
    if (v === "light") root.classList.remove("dark");
    else root.classList.add("dark");
  } catch (_) {}
})();`}
        </Script>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
