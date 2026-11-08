// Merges data/recipes/*.json with photo and video parts into data/library.json (full)
// and data/index.json (light, for the client). Runs before dev and build.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
const readParts = (prefix) => {
  const dir = path.join(root, 'data/_parts')
  if (!fs.existsSync(dir)) return {}
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.json'))
    .reduce((all, f) => ({ ...all, ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }), {})
}

const images = { ...readParts('images-'), ...(fs.existsSync(path.join(root, 'data/images.json')) ? read('data/images.json') : {}) }
const videos = { ...readParts('videos-'), ...(fs.existsSync(path.join(root, 'data/videos.json')) ? read('data/videos.json') : {}) }

const dir = path.join(root, 'data/recipes')
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : []

const required = ['slug', 'name', 'country', 'region', 'course', 'summary', 'story', 'ingredients', 'steps', 'nutrition', 'diet']
const library = []
const skipped = []
const slugs = new Set(files.map((f) => f.replace(/\.json$/, '')))

for (const file of files) {
  const slug = file.replace(/\.json$/, '')
  let recipe
  try {
    recipe = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  } catch (e) {
    skipped.push(`${slug}: invalid JSON`)
    continue
  }
  const missing = required.filter((k) => recipe[k] === undefined)
  if (missing.length) {
    skipped.push(`${slug}: missing ${missing.join(', ')}`)
    continue
  }
  const image = images[slug]
  if (!image || !fs.existsSync(path.join(root, 'public', image.file))) {
    skipped.push(`${slug}: no photo`)
    continue
  }
  recipe.slug = slug
  recipe.image = image
  if (videos[slug]) recipe.video = videos[slug]
  recipe.tags = recipe.tags ?? []
  recipe.tips = recipe.tips ?? []
  recipe.swaps = recipe.swaps ?? []
  recipe.servesWith = (recipe.servesWith ?? []).filter((s) => slugs.has(s) && s !== slug)
  recipe.spice = recipe.spice ?? 0
  recipe.prepMinutes = recipe.prepMinutes ?? 15
  recipe.cookMinutes = recipe.cookMinutes ?? 30
  recipe.servings = recipe.servings ?? 4
  recipe.difficulty = recipe.difficulty ?? 'Medium'
  library.push(recipe)
}

// Keep only pairings that survived.
const kept = new Set(library.map((r) => r.slug))
for (const r of library) r.servesWith = r.servesWith.filter((s) => kept.has(s))

const index = library.map((r) => ({
  slug: r.slug,
  name: r.name,
  ...(r.localName ? { localName: r.localName } : {}),
  country: r.country,
  region: r.region,
  course: r.course,
  tags: r.tags,
  diet: r.diet,
  spice: r.spice,
  summary: r.summary,
  totalMinutes: r.prepMinutes + r.cookMinutes,
  servings: r.servings,
  difficulty: r.difficulty,
  image: { file: r.image.file, alt: r.image.alt },
  hasVideo: !!r.video,
  starring: r.ingredients.flatMap((g) => g.items).slice(0, 4).map((i) => i.name.replace(/\s*\(.*\)/, '')),
  keywords: [...new Set(r.ingredients.flatMap((g) => g.items).map((i) => i.name.toLowerCase().replace(/\s*\(.*\)/, '')))],
}))

// Small per-recipe files the shopping list can fetch on demand (cacheable, offline friendly).
const pub = path.join(root, 'public/data/recipes')
fs.rmSync(pub, { recursive: true, force: true })
fs.mkdirSync(pub, { recursive: true })
for (const r of library) {
  fs.writeFileSync(path.join(pub, `${r.slug}.json`), JSON.stringify({ slug: r.slug, name: r.name, servings: r.servings, ingredients: r.ingredients }))
}

fs.writeFileSync(path.join(root, 'data/library.json'), JSON.stringify(library))
fs.writeFileSync(path.join(root, 'data/index.json'), JSON.stringify(index))
console.log(`library: ${library.length} recipes, ${index.length} in index, ${skipped.length} skipped`)
for (const s of skipped) console.log('  skipped', s)
