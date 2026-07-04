# PlantPal

A Next.js web app for anyone looking to expand the number of plants they eat. Track the foods you love, explore new ones at your own pace, and get smart suggestions based on what you already enjoy.

## Features

- **Plate visualization** — A circular plate divided into food group sectors (Vegetables, Grains, Legumes, Other), each with its own hand-drawn icon and muted color. Foods you love live here as compact capsule chips you can drag out to remove or click for details
- **Trying Now sidebar** — Track foods you're actively experimenting with, log each attempt with method and notes, and watch a progress ring fill toward 7 tries
- **Smart suggestions** — Swipeable full-bleed photo cards that recommend new foods based on what's already on your plate. Swipe right (or press →) to add, swipe left (or press ←) to skip
- **Dietary filters** — Filter suggestions by gluten-free, nut-free, soy-free, oil-free, and raw-friendly tags
- **Food search** — Instantly search across all your tracked foods from the header
- **Attempt tracking** — Log each try with cooking method, rating, and notes
- **Recipe browser** — 100 recipes from top plant-based sites with category filters
- **Progress stats** — An always-visible quick strip (foods loved, exploring, total attempts) plus a full stats view: most-tried food, favourite cooking methods, and per-food progress rings
- **Guided onboarding** — First-time visitors pick a few foods they already enjoy, flag what makes eating more plants tricky, and set dietary needs — pre-filling their plate and Discover filters in under a minute
- **Sign in & sync** — Optional passwordless (magic link) email sign-in to sync your data across devices via Supabase; works fully offline as a guest otherwise
- **Export / Import** — Back up your full food list to JSON and restore it on any device
- **Dark mode** — Toggle between light and dark themes
- **Accessible** — Full keyboard navigation, ARIA roles and labels, visible focus rings, and screen reader support throughout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
npm test        # run the test suite
npm run lint    # lint the codebase
```

Cloud sync is optional — the app works fully with just `npm install && npm run dev`. To enable sign-in/sync locally, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` for a Supabase project.

## How It Works

### Your Plate

Foods you love are displayed inside a plate divided into four colored sectors by food type. Each food shows as a capsule chip with its name. You can:
- **Drag a food outside the rim** to remove it
- **Click a food** (or press Enter/Space when focused) to view details, move to Exploring, or remove

### Trying Now

Foods you're working up to live in the sidebar. Tap **+** to log an attempt — pick a cooking method, rate it, and add notes. A progress ring tracks how many times you've tried each food (goal: 7).

### Discover

The suggestion card shows a food recommended based on what you already love, with a photo, food group badge, and a recipe hint:
- **Try it!** (or press →) — adds the food to Exploring
- **Skip** (or press ←) — cycles to the next suggestion

Filter suggestions by dietary tag using the chips above the card. Tags are derived automatically from the food's name and type — no manual tagging required.

### Search

Type in the search bar at the top to filter across all your tracked foods. Click a result to open its detail view.

### Stats

The home screen shows a quick stats strip (foods loved, exploring, total attempts) at all times. Tap **Full stats →** to see:
- Total foods on your plate and total attempts logged
- Your most-tried food
- Top 3 cooking methods with a proportional bar chart
- Per-food progress rings for everything currently in Exploring

### Onboarding

New visitors are guided through a short setup: pick 2–5 foods they already enjoy, optionally flag what makes eating more plants tricky (time, texture, cost, etc.), and set dietary needs. This seeds the plate and pre-fills the Discover filters. Skippable at any step.

### Sign in & Sync

Use the options menu (**⋯**) → **Sign in / Sync** to enter your email and receive a magic sign-in link — no password required. Once signed in, your food list and dismissed suggestions sync to Supabase and follow you across devices. Without signing in, everything is stored locally in the browser.

### Export / Import

Use the **Export backup** option to download a `flavorfriend-backup-{date}.json` file. Use **Import backup** to restore from that file on any device.

## Categories

| Category | Description |
|----------|-------------|
| Love | Foods you already enjoy — shown on your plate |
| Exploring | Foods you're actively trying |
| Curious | Foods you'd like to try (added via suggestions) |
| Not yet | Foods you're avoiding for now |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (optional auth + cloud sync; falls back to localStorage as a guest)
- lucide-react for icons
- Vitest + React Testing Library (45 tests)

## Project Structure

```
src/
  app/
    auth/callback/  # Supabase magic-link callback route
    page.tsx        # orchestrates state and tabs
  components/       # Plate, TryingNow, SuggestionCard, RecipeBrowser,
                     # AttemptModal, FoodDetailModal, StatsModal, AuthModal,
                     # WelcomeModal, JourneyStats, ModalShell
  hooks/            # useFoodsStorage, useDismissedSuggestions, useAuth,
                     # useOnboarding, useLatestRef
  lib/
    supabase/       # client, server, and db helpers
    types.ts, constants.ts, theme.ts, foods.ts, recipes.ts, foodIcons.tsx
  test/             # Vitest setup and utilities
```

## Smart Suggestions

Foods are suggested based on similarity to what's already on your plate. If no direct matches exist, the app falls back to:
1. Popular ingredients (tofu, chickpeas, lentils, etc.)
2. Most versatile foods (4+ cooking methods)
3. A random selection from the database

Suggestion photos come from a fallback chain — a Spoonacular ingredient photo, then the food's own or a parent food's image, then a stock photo service — before falling back to a plain icon if all else fails. Recipe thumbnails and suggestion photos are served through `next/image` for automatic resizing.

## Recipe Sources

- The Plant Based School
- From My Bowl
- Minimalist Baker
- Rainbow Plant Life
- Plant-Based on a Budget
- Sweet Potato Soul
- Plant Based RD
- It Doesn't Taste Like Chicken
- That Vegan Babe
- Love and Lemons
