import type { Recipe, ShoppingEntry } from './types'
import { fixUnits, formatNumber, parseAmount, scaleAmount } from './scale'

export type Aisle = 'Fresh produce' | 'Meat, fish and eggs' | 'Grains, flours and tubers' | 'Beans, nuts and seeds' | 'African pantry' | 'Spices and seasoning' | 'Oils, dairy and drinks' | 'Everything else'

export const AISLE_ORDER: Aisle[] = [
  'Fresh produce',
  'Meat, fish and eggs',
  'Grains, flours and tubers',
  'Beans, nuts and seeds',
  'African pantry',
  'Spices and seasoning',
  'Oils, dairy and drinks',
  'Everything else',
]

const RULES: [Aisle, RegExp][] = [
  ['African pantry', /(egusi|ogbono|iru|locust bean|crayfish|stockfish|stock fish|ponmo|palm oil|garri|gari|banga|palm fruit|uziza|utazi|ugu|bitterleaf|bitter leaf|ofada|ayamase|suya spice|yaji|kuka|tigernut|ogiri|dawadawa|efo|ewedu|gbegiri|cassava|fufu|poundo|amala|elubo|injera|teff|berbere|niter kibbeh|chakalaka|mielie|sorghum|millet|fonio|dried fish|smoked fish)/i],
  ['Meat, fish and eggs', /(chicken|beef|goat|lamb|turkey|fish|tilapia|catfish|mackerel|titus|prawn|shrimp|meat|oxtail|tripe|cow|liver|gizzard|egg|sausage|suya|kidney|tongue|bone|sardine)/i],
  ['Fresh produce', /(tomato|onion|pepper|scotch|bonnet|habanero|chilli|chili|ginger|garlic|plantain|spinach|kale|sukuma|greens|leaf|leaves|cabbage|carrot|cucumber|lime|lemon|orange|mango|pineapple|banana|okra|pumpkin|aubergine|eggplant|potato|yam|coconut|herb|parsley|coriander|cilantro|basil|thyme|mint|scallion|spring onion|tatashe|rodo|celery|bell pepper|avocado|cassava)/i],
  ['Grains, flours and tubers', /(rice|flour|semolina|cornmeal|maize|corn|oat|wheat|bread|pasta|spaghetti|macaroni|noodle|couscous|starch|yeast|baking|breadcrumb)/i],
  ['Beans, nuts and seeds', /(bean|lentil|chickpea|peanut|groundnut|cashew|almond|sesame|seed|nut|pea)/i],
  ['Spices and seasoning', /(salt|pepper powder|black pepper|cayenne|paprika|cumin|coriander seed|turmeric|curry|thyme|bay|nutmeg|cinnamon|clove|cardamom|cube|bouillon|stock cube|seasoning|spice|masala|saffron|vinegar|sugar|honey|mustard|msg)/i],
  ['Oils, dairy and drinks', /(oil|butter|margarine|milk|cream|yogurt|yoghurt|cheese|ghee|water|stock|broth|wine|beer|tea|hibiscus|zobo|juice|soda|coconut milk|evaporated)/i],
]

export function aisleFor(name: string): Aisle {
  for (const [aisle, rx] of RULES) if (rx.test(name)) return aisle
  return 'Everything else'
}

const key = (name: string) =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\b(fresh|large|small|medium|chopped|diced|sliced|ground|dried|finely|roughly|whole|ripe|raw)\b/g, '')
    .replace(/[^a-z ]/g, '')
    .replace(/(\w{3,})s\b/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

interface Bucket {
  name: string
  sums: Map<string, { qty: number; unit: string }>
  paren: Map<string, number>
  texts: Set<string>
  from: Set<string>
}

/** Add up the ingredients of several recipes (scaled to the servings wanted). */
export function buildShoppingList(
  picks: { recipe: Pick<Recipe, 'name' | 'servings' | 'ingredients'>; servings: number }[],
): Omit<ShoppingEntry, 'id' | 'checked'>[] {
  const buckets = new Map<string, Bucket>()
  for (const { recipe, servings } of picks) {
    const factor = servings / recipe.servings
    for (const group of recipe.ingredients) {
      for (const item of group.items) {
        const k = key(item.name) || item.name.toLowerCase()
        const b = buckets.get(k) ?? { name: item.name.replace(/\s*\(.*\)/, ''), sums: new Map(), paren: new Map(), texts: new Set(), from: new Set() }
        b.from.add(recipe.name)
        const parsed = parseAmount(item.amount)
        if (parsed) {
          const prev = b.sums.get(parsed.unit) ?? { qty: 0, unit: parsed.unit }
          prev.qty += parsed.qty * factor
          b.sums.set(parsed.unit, prev)
          if (parsed.paren) b.paren.set(parsed.paren.unit, (b.paren.get(parsed.paren.unit) ?? 0) + parsed.paren.qty * factor)
        } else {
          b.texts.add(scaleAmount(item.amount, factor))
        }
        buckets.set(k, b)
      }
    }
  }

  return [...buckets.values()].map((b) => {
    const parts: string[] = [...b.sums.values()].map((s) => fixUnits(`${formatNumber(s.qty)}${s.unit ? ' ' + s.unit : ''}`))
    const paren = [...b.paren.entries()].map(([u, q]) => `${formatNumber(q)} ${u}`)
    let amount = parts.join(' + ')
    if (paren.length && b.sums.size === 1) amount += ` (${paren.join(' + ')})`
    if (b.texts.size) amount = [amount, ...b.texts].filter(Boolean).join(' + ')
    return { name: b.name, amount, from: [...b.from], custom: false }
  })
}
