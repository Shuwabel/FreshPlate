const FRACTIONS: Record<string, number> = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 }
const NUMBER = /(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.\d+|\d+\s?[¼½¾⅓⅔⅛]|[¼½¾⅓⅔⅛]|\d+)/g

function parseNumber(token: string): number {
  const t = token.trim()
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3])
  const frac = t.match(/^(\d+)\/(\d+)$/)
  if (frac) return Number(frac[1]) / Number(frac[2])
  const uni = t.match(/^(\d+)?\s?([¼½¾⅓⅔⅛])$/)
  if (uni) return Number(uni[1] ?? 0) + FRACTIONS[uni[2]]
  return Number(t)
}

/** Friendly cooking numbers: quarters for small amounts, whole numbers for big ones. */
export function formatNumber(n: number): string {
  if (n >= 100) return String(Math.round(n / 5) * 5)
  if (n >= 10) return String(Math.round(n))
  const quarters = Math.round(n * 4) / 4
  if (quarters === 0) return n < 0.125 ? '1/8' : '1/4'
  const whole = Math.floor(quarters)
  const rest = quarters - whole
  const frac = rest === 0.25 ? '¼' : rest === 0.5 ? '½' : rest === 0.75 ? '¾' : ''
  if (!frac) return String(whole)
  return whole === 0 ? frac : `${whole}${frac}`
}

const COUNTABLE = 'cup|tablespoon|teaspoon|clove|bunch|piece|slice|stalk|sprig|handful|pinch|can|tin|stick|ball|fillet|wrap|bulb|head|leaf|sachet|cube|pod|knob'
const UNIT_RX = new RegExp(String.raw`(^|[\s(])(1|¼|½|¾|⅓|⅔|⅛|1/2|1/4|3/4)\s(${COUNTABLE})s\b`, 'g')
const UNIT_PLURAL_RX = new RegExp(String.raw`(\d+(?:[½¼¾])?|\d+\.\d+)\s(${COUNTABLE})\b(?!s)`, 'g')

/** "1 cups" becomes "1 cup" and "2 cup" becomes "2 cups". */
export function fixUnits(text: string): string {
  return text
    .replace(UNIT_RX, (_m, pre, q, unit) => `${pre}${q} ${unit}`)
    .replace(UNIT_PLURAL_RX, (m, q, unit) => (q === '1' ? m : `${q} ${unit}s`))
}

/** Scale every number inside an amount string ("2 cups (400 g)" doubles both). */
export function scaleAmount(amount: string, factor: number): string {
  if (factor === 1 || !/[\d¼½¾⅓⅔⅛]/.test(amount)) return amount
  return fixUnits(amount.replace(NUMBER, (token) => formatNumber(parseNumber(token) * factor)))
}

export interface ParsedAmount {
  qty: number
  unit: string
  paren: { qty: number; unit: string } | null
}

/** Reads "2 cups (400 g)" into numbers so shopping lists can add them up. */
export function parseAmount(amount: string): ParsedAmount | null {
  const m = amount.trim().match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.\d+|\d+\s?[¼½¾⅓⅔⅛]|[¼½¾⅓⅔⅛]|\d+)\s*([a-zA-Z]*)/)
  if (!m) return null
  const qty = parseNumber(m[1])
  if (!Number.isFinite(qty)) return null
  const paren = amount.match(/\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)/)
  return {
    qty,
    unit: m[2].toLowerCase().replace(/s$/, ''),
    paren: paren ? { qty: Number(paren[1]), unit: paren[2].toLowerCase() } : null,
  }
}
