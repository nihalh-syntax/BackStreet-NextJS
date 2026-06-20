"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"

import { APP_THEME_STORAGE_KEY } from "./constants"

type AppThemeProviderProps = {
  children: ReactNode
}

/**
 * Global appearance: sets `class="dark"` on `<html>` (see `index.css` `.dark`).
 * Wrap the whole app so every route and portal inherits the same tokens.
 */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      themes={["light", "dark"]}
      enableSystem={false}
      enableColorScheme
      storageKey={APP_THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
