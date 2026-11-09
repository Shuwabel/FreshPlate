# Product

## Platform

web

## Users
Home cooks who want to cook well tonight: Nigerians and the African diaspora cooking dishes they grew up with (often abroad, with some ingredients hard to find), and curious cooks learning African cuisine for the first time. They use a phone in the kitchen, often on mobile data, with messy hands. (Inferred.)

## Product Purpose
FreshPlate helps people decide what to cook and then actually cook it: browse a deep library of African recipes (Nigerian cuisine first), follow clear step-by-step instructions with a cooking video, scale servings, save favourites, plan the week and build a shopping list. Success is a meal on the table that tastes right. (Given: discovery, favourites, meal planner, tutorials. Inferred: success measure.)

## Positioning
The recipe app where Nigerian and wider African food is the main course, not a filter: authentic methods, substitutions for cooks abroad, real photos and real video tutorials, working offline-friendly features. (Inferred from the owner's brief.)

## Operating Context
Cooking happens at the stove: big readable steps, tick-off ingredients, timers, no account needed. Planning happens on a phone or laptop on the weekend. Data (favourites, plans) lives in the browser. (Given in README: browser-local storage.)

## Capabilities and Constraints
- Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, zustand; deploys on Vercel as a mostly static site.
- Own recipe library in `data/recipes` (original text, Nigerian-first) with photos in `public/dishes` (free-licence, credited) and YouTube tutorial ids. TheMealDB (free, limited, little African coverage) is a secondary source only.
- No accounts, no backend, no paid APIs, no API keys.
- Undecided: user-submitted recipes, sync across devices.

## Brand Commitments
Name: FreshPlate. No logo or voice rules were given beyond the name. (Given: name.)

## Evidence on Hand
66 candidate African dishes written for this app; photos are CC-licensed from Wikimedia Commons and must be credited; videos are third-party YouTube embeds. No testimonials, user counts or ratings exist. Do not invent any.

## Product Principles
- African food first, and told with respect: say where a dish comes from and when it is eaten, without clichés.
- Made for the stove: legible at arm's length, usable with wet hands, works on slow connections.
- Honest: estimates are labelled as estimates, photo and video credits are visible, nothing is faked.
- Every recipe is complete: ingredients with amounts, real steps with doneness cues, a swap for hard-to-find items.
