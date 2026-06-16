export const SITE_DISCOUNT_PERCENT = 20
export const DELIVERY_FEE = 10

export type OrderItemForTotal = {
  unitPrice: number
  quantity: number
}

/** Must match server `resolvePromoFlat` — flat $ off after member discount. */
export function promoDiscountFromCode(
  code: string | null | undefined,
): number {
  if (!code?.trim()) return 0
  const n = code.trim().toUpperCase()
  if (n === "SAVE10") return 10
  if (n === "WELCOME") return 15
  return 0
}

export function computeOrderTotal(
  items: OrderItemForTotal[],
  promoCode: string | null | undefined,
) {
  const sub = items.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0)
  const d20 = sub * (SITE_DISCOUNT_PERCENT / 100)
  const promoFlat = promoDiscountFromCode(promoCode)
  const promo =
    promoFlat > 0 ? Math.min(promoFlat, Math.max(0, sub - d20)) : 0
  const del = items.length > 0 ? DELIVERY_FEE : 0
  const tot = Math.max(0, sub - d20 - promo + del)
  return {
    subtotal: sub,
    discount20: d20,
    promoOff: promo,
    delivery: del,
    total: tot,
  }
}
