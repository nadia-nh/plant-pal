# PlantPal - Developer Guide

## Project Overview
A Next.js web app for anyone looking to expand the number of plants they eat. Track foods you love, get plant-based cooking suggestions, log attempts, and discover new vegetables, grains, and legumes at your own pace. Works fully offline (localStorage) or signed in with cloud sync via Supabase.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (no `dark:` variant — see Styling Conventions below)
- **Icons**: lucide-react, plus a handful of hand-drawn category icons
- **Auth / sync**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — optional; guest mode uses localStorage only
- **Testing**: Vitest + React Testing Library (45 tests)

## File Structure

```
PlantPal/
├── src/
│   ├── app/
│   │   ├── auth/callback/route.ts  # Supabase magic-link redirect handler
│   │   ├── globals.css             # Global Tailwind styles
│   │   ├── layout.tsx              # Root layout with metadata, Playfair Display font
│   │   └── page.tsx                # Main app component
│   ├── components/                 # UI components (Plate, SuggestionCard, modals, etc.)
│   ├── hooks/                      # Custom React hooks
│   ├── lib/
│   │   ├── supabase/               # client.ts, server.ts, db.ts (auth + sync helpers)
│   │   ├── constants.ts            # App constants
│   │   ├── theme.ts                # Shared dm-conditional style helpers
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── foods.ts                # Food suggestions database
│   │   ├── foodIcons.tsx           # Hand-drawn category icon components
│   │   └── recipes.ts              # Recipe database
│   └── test/                       # Vitest setup
├── public/
│   └── placeholder-vegetable.svg   # Fallback recipe image
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript config
├── tailwind.config.js               # Tailwind config
├── next.config.js                  # Next.js config (images.remotePatterns for recipe/food photo hosts)
├── postcss.config.js               # PostCSS config
├── PLAN.md                         # Original project plan (historical)
└── README.md                       # User documentation
```

## Key Files

### `src/app/page.tsx`
Main orchestrator component that handles:
- Global state and tab navigation (Home, Discover, Recipes)
- Combining components like `Plate`, `TryingNow`, and `RecipeBrowser`
- Dark mode, data export/import, search, and wiring up all 5 modals

### `src/components/`
Core UI components:
- `Plate.tsx` - Visualizes the foods you love as capsule chips on a sector-colored plate
- `TryingNow.tsx` - Sidebar for tracking and progressing foods
- `SuggestionCard.tsx` - Swipeable card for discovering new foods; owns the image-fallback chain
- `RecipeBrowser.tsx` - Filterable recipe catalog
- `JourneyStats.tsx` - Always-visible quick stats strip on the home tab
- `ModalShell.tsx` - Shared backdrop/panel/focus-management wrapper used by all 5 modals below
- `FoodDetailModal.tsx`, `AttemptModal.tsx`, `StatsModal.tsx`, `AuthModal.tsx`, `WelcomeModal.tsx` - Modal dialogs, each rendered via `ModalShell`

### `src/hooks/`
- `useFoodsStorage.ts` - Persists the food list to localStorage (guest) or Supabase (signed in), with auto-migration on first login
- `useDismissedSuggestions.ts` - Tracks dismissed suggestion cards, same local/cloud split
- `useAuth.ts` - Wraps Supabase session state, magic-link sign-in, and sign-out
- `useOnboarding.ts` - Tracks whether the first-run welcome flow has been completed
- `useLatestRef.ts` - Generic helper: keeps a ref in sync with a value via an effect (avoids writing `ref.current` during render)

### `src/lib/theme.ts`
Shared style helpers used across components — see Styling Conventions below.

### `src/lib/types.ts`
TypeScript interfaces:
- `FoodCategory` - 'love' | 'exploring' | 'curious' | 'notYet'
- `Food` - Main food item with attempts, history, notes
- `Attempt` - Individual attempt record
- `CookingMethod` - Cooking suggestion with difficulty
- `FoodSuggestion` - Full suggestion for a food (with image, similarTo as array)
- `RecipeCategory` - 15 recipe categories
- `Recipe` - Recipe entry with image, source, prep time

### `src/lib/foods.ts`
Data + lookups:
- `foodSuggestions` - Array of foods with images and multiple similar foods
- `getSuggestionsForFood()` - Lookup by food name (case-insensitive); `getFoodType()` and `getTagsForFood()` both delegate to this rather than re-searching
- `getSimilarFoods()` - Get suggested foods based on safe foods (matches any similarTo)
- `getSimilarFoodsFallback()` - Fallback: popular → versatile → random
- `getAllSuggestedFoods()` - Get all food names

### `src/lib/recipes.ts`
Data:
- `recipes` - Array of 100 recipes from 10 plant-based sites
- `getRecipeForFood()` - Find recipe mentioning a specific food
- Dynamic category generation for filters

### `src/lib/supabase/`
- `client.ts` - Browser Supabase client (reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `server.ts` - Server-side client for the auth callback route
- `db.ts` - `fetchFoods`/`saveFoods`/`fetchDismissed`/`saveDismissed` — the read/write layer `useFoodsStorage`/`useDismissedSuggestions` call into

## Styling Conventions

The app does **not** use Tailwind's `dark:` variant. Every component that needs dark-mode styling takes a `darkMode: boolean` prop, aliases it locally as `const dm = darkMode`, and builds classNames with `` `${dm ? 'dark-classes' : 'light-classes'}` `` ternaries. There is no `clsx`/`cva`/`cn()` utility in this project — don't introduce one for a small change; condense repeated ternaries with plain functions (see `src/lib/theme.ts`: `surface`, `textPrimary`, `textSecondary`, `inputField`, `dropdownItem`) or small local subcomponents instead, matching the existing pattern.

Modals should be built on top of `ModalShell` (`src/components/ModalShell.tsx`) rather than hand-rolling a backdrop + panel. It owns the backdrop, panel surface/sizing, ARIA wiring, and focus-on-open management; pass `onBackdropClick`/`onEscape` only if that modal should actually close on those actions (some, like `AttemptModal`, intentionally don't, to avoid discarding in-progress input).

Category icons live in `src/lib/foodIcons.tsx` (`FoodTypeIcon`) and are driven by `FOOD_TYPE_CONFIG` in `constants.ts`, which holds each food type's fill/stroke colors (light and dark variants) and icon name — update both together when adding a food type.

## Data Storage
- **Guest mode** (default): `flavorfriend-foods` and a dismissed-suggestions key in localStorage, JSON arrays.
- **Signed in**: same shape, persisted via `src/lib/supabase/db.ts`; local data is migrated to Supabase on first login, and localStorage is cleared once Supabase is the source of truth.
- Empty/missing data falls back to a small set of default foods (see `useFoodsStorage.ts`).

## Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run the Vitest suite (45 tests)
```

## Categories

| Category | Description |
|----------|-------------|
| Love | Plants you already enjoy |
| Exploring | Plants you're actively trying |
| Curious | Plants you'd like to try |
| Not yet | Plants you'd rather avoid |

Rendered with lucide icons (`Heart`, `Sprout`, `Sparkles`, `Ban` — see `CATEGORY_META` in `FoodDetailModal.tsx`), not emoji.

## Features
1. **Food Management** - Add, edit, delete, categorize foods
2. **Attempt Tracking** - Log each try with method, rating, notes
3. **7-Try Milestone** - Progress ring toward `ATTEMPT_GOAL` (7) attempts per food
4. **Progress Dashboard** - Inline quick-stats strip plus a full stats modal
5. **Cooking Suggestions** - Multiple methods per food with difficulty, tips, easy meals
6. **Smart Suggestions** - Multi-similar-to matching, fallback system, swipe or arrow-key interaction
7. **Recipe Browser** - 100 recipes with dynamic category filters, images via `next/image`
8. **Guided Onboarding** - First-run wizard (`WelcomeModal.tsx`) picks starter foods, barriers, and dietary tags
9. **Sign in / Sync** - Optional passwordless email auth with cross-device sync
10. **Dark Mode** - Toggle between light and dark themes (see Styling Conventions)

## Adding New Foods to Suggestions
Edit `src/lib/foods.ts` — add to `foodSuggestions` array:
```typescript
{
  name: 'NewFood',
  foodType: 'vegetable', // 'vegetable' | 'grain' | 'legume' | 'other'
  similarTo: ['SimilarFood1', 'SimilarFood2', 'SimilarFood3'],
  cookingMethods: [
    { name: 'Method', description: '...', tips: [], difficulty: 'easy' }
  ],
  easyMeals: ['Meal 1', 'Meal 2'],
  image: 'https://upload.wikimedia.org/...' // Optional: Wikimedia Commons URL
}
```
If `image` is omitted, `SuggestionCard` falls back through a Spoonacular ingredient photo, a parent food's image (via the optional `parent` field), then a stock photo service, then a plain icon.

## Recipe Browser
- Recipes from: The Plant Based School, From My Bowl, Minimalist Baker, Rainbow Plant Life, Plant-Based on a Budget, Sweet Potato Soul, Plant Based RD, It Doesn't Taste Like Chicken, That Vegan Babe, Love and Lemons
- Dynamic category filters (only shows categories with recipes)
- Grid cards: image via `next/image` with `fill`, title, source badge, prep time
- Fallback to `placeholder-vegetable.svg` on image error

## Suggestion System
1. **Primary**: Foods similar to your "Love" items (matches any similarTo)
2. **Fallback**: Popular ingredients → Most versatile (4+ methods) → Random
3. **Display**: Food image (with fallback chain) + example recipe title for each suggestion, both via `getRecipeForFood`/`getImageCandidates`
