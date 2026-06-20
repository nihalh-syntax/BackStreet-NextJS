"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { ProductSource } from "@/data/productCatalog"

const STORAGE_KEY = "backstreet-cart"

export type CartLineItem = {
  /** Stable key for merging identical variants */
  lineKey: string
  productId: string
  source: ProductSource
  name: string
  imageUrl: string
  unitPrice: number
  size: string
  colorLabel: string
  colorId: string
  quantity: number
}

export type AddToCartInput = {
  productId: string
  source: ProductSource
  name: string
  imageUrl: string
  unitPrice: number
  size: string
  colorLabel: string
  colorId: string
  quantity: number
}

function makeLineKey(
  source: ProductSource,
  productId: string,
  size: string,
  colorId: string,
) {
  return `${source}:${productId}:${size}:${colorId}`
}

function parseStored(json: unknown): CartLineItem[] {
  if (!Array.isArray(json)) return []
  const out: CartLineItem[] = []
  for (const row of json) {
    if (!row || typeof row !== "object") continue
    const r = row as Record<string, unknown>
    const source = r.source
    const productId = r.productId
    const lineKey = r.lineKey
    const name = r.name
    const imageUrl = r.imageUrl
    const unitPrice = r.unitPrice
    const size = r.size
    const colorLabel = r.colorLabel
    const colorId = r.colorId
    const quantity = r.quantity
    if (
      (source !== "newArrivals" && source !== "topSelling") ||
      typeof productId !== "string" ||
      typeof lineKey !== "string" ||
      typeof name !== "string" ||
      typeof imageUrl !== "string" ||
      typeof unitPrice !== "number" ||
      typeof size !== "string" ||
      typeof colorLabel !== "string" ||
      typeof colorId !== "string" ||
      typeof quantity !== "number" ||
      quantity < 1
    ) {
      continue
    }
    out.push({
      lineKey,
      productId,
      source,
      name,
      imageUrl,
      unitPrice,
      size,
      colorLabel,
      colorId,
      quantity: Math.floor(quantity),
    })
  }
  return out
}

type CartContextValue = {
  items: CartLineItem[]
  itemCount: number
  addItem: (input: AddToCartInput) => void
  removeItem: (lineKey: string) => void
  setLineQuantity: (lineKey: string, quantity: number) => void
  appliedPromo: { code: string; discount: number } | null
  setPromo: (promo: { code: string; discount: number } | null) => void
  clearPromo: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return parseStored(JSON.parse(raw) as unknown)
    } catch {
      return []
    }
  })

  const [appliedPromo, setAppliedPromo] = useState<{
    code: string
    discount: number
  } | null>(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}-promo`)
      if (!raw) return null
      const p = JSON.parse(raw) as { code?: string; discount?: number }
      if (
        typeof p.code === "string" &&
        typeof p.discount === "number" &&
        p.discount > 0
      ) {
        return { code: p.code, discount: p.discount }
      }
      return null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(
          `${STORAGE_KEY}-promo`,
          JSON.stringify(appliedPromo),
        )
      } else {
        localStorage.removeItem(`${STORAGE_KEY}-promo`)
      }
    } catch {
      /* ignore */
    }
  }, [appliedPromo])

  const addItem = useCallback((input: AddToCartInput) => {
    const lineKey = makeLineKey(
      input.source,
      input.productId,
      input.size,
      input.colorId,
    )
    const qty = Math.max(1, Math.floor(input.quantity))

    setItems((prev) => {
      const idx = prev.findIndex((l) => l.lineKey === lineKey)
      if (idx >= 0) {
        const next = [...prev]
        const row = next[idx]!
        next[idx] = {
          ...row,
          quantity: row.quantity + qty,
          unitPrice: input.unitPrice,
          name: input.name,
          imageUrl: input.imageUrl,
          size: input.size,
          colorLabel: input.colorLabel,
        }
        return next
      }
      return [
        ...prev,
        {
          lineKey,
          productId: input.productId,
          source: input.source,
          name: input.name,
          imageUrl: input.imageUrl,
          unitPrice: input.unitPrice,
          size: input.size,
          colorLabel: input.colorLabel,
          colorId: input.colorId,
          quantity: qty,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((l) => l.lineKey !== lineKey))
  }, [])

  const setLineQuantity = useCallback((lineKey: string, quantity: number) => {
    const q = Math.floor(quantity)
    if (q < 1) {
      setItems((prev) => prev.filter((l) => l.lineKey !== lineKey))
      return
    }
    setItems((prev) =>
      prev.map((l) => (l.lineKey === lineKey ? { ...l, quantity: q } : l)),
    )
  }, [])

  const setPromo = useCallback(
    (promo: { code: string; discount: number } | null) => {
      setAppliedPromo(promo)
    },
    [],
  )

  const clearPromo = useCallback(() => setAppliedPromo(null), [])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedPromo(null)
  }, [])

  const itemCount = useMemo(
    () => items.reduce((acc, l) => acc + l.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      addItem,
      removeItem,
      setLineQuantity,
      appliedPromo,
      setPromo,
      clearPromo,
      clearCart,
    }),
    [
      items,
      itemCount,
      addItem,
      removeItem,
      setLineQuantity,
      appliedPromo,
      setPromo,
      clearPromo,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}
