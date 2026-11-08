# FreshPlate

African recipes you can actually cook. Nigerian food first, then Ghana, Senegal, Ethiopia, Kenya, South Africa, Morocco and more. Every dish has a real photo, amounts you can shop for, steps with doneness cues, a swap for hard-to-find ingredients and, where possible, a video tutorial.

No accounts, no backend and no API keys. Favourites, meal plans and the shopping list live in the browser.

## What it does

- **Explore**: search by dish or country, filter by type, diet, time and heat, or type the ingredients you have.
- **Recipe page**: servings scaler, tick-off ingredients, step list with timers, cultural note, swaps, rough nutrition, print view, video that loads only when you press play.
- **Cook mode**: one step at a time in large type, per-step timer, screen kept awake.
- **Meal plan**: seven days of breakfast, lunch and dinner by diet, heat and Nigerian-first or all-Africa; swap any meal.
- **Shopping list**: adds the same ingredient across recipes, scales to your servings, groups by aisle (with an African pantry aisle), shares by copy or WhatsApp.
- **Saved** and recently viewed recipes.

## The recipe library

The library is the app's own data, not an API:

- `data/dishes.json`: the dish list (slug, name, country).
- `data/recipes/<slug>.json`: one recipe each (original text).
- `data/_parts/images-*.json`: photo credits; the photos are in `public/dishes/` and come from Wikimedia Commons under free licences.
- `data/_parts/videos-*.json`: YouTube tutorial ids (embedded only on demand, from the creators' own channels).
- `scripts/build-library.mjs` merges these into `data/library.json` and `data/index.json` (and small per-recipe files for the shopping list). It runs before `dev` and `build`. A recipe without a photo is left out.

To add a dish: add a recipe JSON, a photo in `public/dishes/` and its credit in `data/_parts/images-*.json`, then run `npm run library`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## Deploy

Import the repository on Vercel. No environment variables are needed.

## Credits

Photo and video credits are on each recipe page and at `/credits`. Calorie figures are rough estimates.
