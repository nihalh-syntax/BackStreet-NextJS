export const SITE_DISCOUNT_PERCENT = 20
export const DELIVERY_FEE = 10

export type OrderItemForTotal = {
  unitPrice: number
  quantity: number
}

export function computeOrderTotal(
  items: OrderItemForTotal[],
  promoFlat = 0,
) {
  const sub = items.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0)
  const d20 = sub * (SITE_DISCOUNT_PERCENT / 100)
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
