'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { FoodCategory } from '@/lib/types'
import { FOOD_TYPE_CONFIG, SWIPE_ADD_THRESHOLD, SWIPE_DETECT_THRESHOLD } from '@/lib/constants'
import { getSuggestionsForFood, getParentSuggestion } from '@/lib/foods'
import { getRecipeForFood } from '@/lib/recipes'
import { FoodTypeIcon } from '@/lib/foodIcons'
import { surface } from '@/lib/theme'

const SPOONACULAR_SLUG_OVERRIDES: Record<string, string> = {
  'oats': 'rolled-oats',
  'sweet potato': 'sweet-potato',
  'bell peppers': 'red-pepper',
  'brussels sprouts': 'brussels-sprouts',
  'green beans': 'green-beans',
  'coconut milk': 'coconut-milk',
  'textured vegetable protein': 'tvp',
  'soy curls': 'edamame',
  'black beans': 'black-beans',
  'kidney beans': 'kidney-beans',
  'chia seeds': 'chia-seeds',
  'butternut squash': 'butternut-squash',
  'nutritional yeast': 'nutritional-yeast',
  'tomatoes': 'tomato',
  'peppers': 'pepper',
  'onions': 'red-onion',
  'corn': 'corn-on-the-cob',
  'tahini': 'sesame-seeds',
  'rice (all)': 'cooked-white-rice',
  'rice (white)': 'cooked-white-rice',
  'rice (brown)': 'brown-rice',
  'beans (all)': 'black-beans',
  'pasta (all)': 'spaghetti',
  'pasta (wheat)': 'spaghetti',
  'pasta (whole wheat)': 'spaghetti',
  // Batch 1–3 new foods
  'bread (all)': 'white-bread',
  'bread (whole wheat)': 'bread-whole-wheat',
  'sourdough': 'sourdough-bread',
  'lettuce': 'iceberg-lettuce',
  'artichoke': 'artichoke-hearts',
  'split peas': 'yellow-split-peas',
  'mung beans': 'bean-sprouts',
  'fava beans': 'broad-beans',
  'hemp seeds': 'hemp-seed',
  'flaxseeds': 'flax-seeds',
  'banana': 'bananas',
  'parsnips': 'parsnip',
  'tortillas': 'flour-tortilla',
  'buckwheat': 'buckwheat-flour',
  'polenta': 'cornmeal',
}

function getIngredientImageUrl(foodName: string): string {
  const key = foodName.toLowerCase()
  const slug = SPOONACULAR_SLUG_OVERRIDES[key] ?? key.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return `https://spoonacular.com/cdn/ingredients_500x500/${slug}.jpg`
}

function getFlickrFallbackUrl(foodName: string): string {
  const clean = foodName.replace(/\s*\(.*?\)\s*/g, ' ').trim()
  const lock = Math.abs(clean.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))
  return `https://loremflickr.com/500/500/${encodeURIComponent(clean)},food?lock=${lock}`
}

function getImageCandidates(foodName: string): string[] {
  const own = getSuggestionsForFood(foodName)?.image
  const parent = getParentSuggestion(foodName)?.image
  return [
    getIngredientImageUrl(foodName),
    ...(own ? [own] : []),
    ...(parent ? [parent] : []),
    getFlickrFallbackUrl(foodName),
  ]
}

function CardBadge({ side, tone, children }: { side: 'left' | 'right'; tone: 'green' | 'amber'; children: React.ReactNode }) {
  return (
    <span className={`absolute top-2 ${side === 'left' ? 'left-2' : 'right-2'} inline-flex items-center gap-1 text-white text-xs font-semibold px-2 py-1 rounded-full leading-none ${tone === 'green' ? 'bg-green-900/90' : 'bg-amber-700/90'}`}>
      {children}
    </span>
  )
}

function SwipeOverlay({ tone, label }: { tone: 'add' | 'skip'; label: string }) {
  return (
    <div className={`absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none ${tone === 'add' ? 'bg-green-700/25' : 'bg-stone-500/30'}`}>
      <span className="text-white font-bold text-2xl drop-shadow-lg">{label}</span>
    </div>
  )
}

function CircleActionButton({ onClick, symbol, caption, variant, dm }: {
  onClick: () => void; symbol: string; caption: string; variant: 'primary' | 'secondary'; dm: boolean
}) {
  const base = 'w-14 h-14 rounded-full text-2xl flex items-center justify-center shadow transition-colors'
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={variant === 'primary'
          ? `${base} bg-green-800 text-white hover:bg-green-900`
          : `${base} border ${dm ? 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700' : 'bg-white border-stone-300 text-stone-500 hover:bg-stone-50'}`}
      >{symbol}</button>
      <span className={variant === 'primary'
        ? `text-xs font-semibold ${dm ? 'text-green-300' : 'text-green-900'}`
        : `text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}
      >{caption}</span>
    </div>
  )
}

interface SuggestionCardProps {
  currentSuggestion: string | undefined
  darkMode: boolean
  hint?: string | null
  onAdd: (category: FoodCategory) => void
  onSkip: () => void
}

export function SuggestionCard({ currentSuggestion, darkMode, hint, onAdd, onSkip }: SuggestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInnerRef = useRef<HTMLDivElement>(null)
  const cardDragRef = useRef<{ startX: number; deltaX: number } | null>(null)
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const dm = darkMode
  const cardSurface = surface(dm)

  useEffect(() => {
    setFallbackIndex(0)
  }, [currentSuggestion])

  const suggestionData = currentSuggestion ? getSuggestionsForFood(currentSuggestion) : undefined
  const exampleRecipe = currentSuggestion ? getRecipeForFood(currentSuggestion) : undefined

  if (!currentSuggestion) {
    return (
      <div className={`${cardSurface} rounded-2xl border shadow-lg p-8`}>
        <p className={`text-center ${dm ? 'text-stone-400' : 'text-stone-500'}`}>No more suggestions right now — check back later!</p>
      </div>
    )
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    cardDragRef.current = { startX: e.clientX, deltaX: 0 }
    cardRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = cardDragRef.current
    if (!drag) return
    const deltaX = e.clientX - drag.startX
    drag.deltaX = deltaX
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`
    }
    setSwipeDir(deltaX > SWIPE_DETECT_THRESHOLD ? 'right' : deltaX < -SWIPE_DETECT_THRESHOLD ? 'left' : null)
  }

  const handlePointerUp = () => {
    const drag = cardDragRef.current
    if (!drag) return
    const { deltaX } = drag
    cardDragRef.current = null
    if (cardInnerRef.current) cardInnerRef.current.style.transform = ''
    setSwipeDir(null)
    if (deltaX > SWIPE_ADD_THRESHOLD) onAdd('exploring')
    else if (deltaX < -SWIPE_ADD_THRESHOLD) onSkip()
  }

  const handleImageError = () => setFallbackIndex(i => i + 1)

  const imageCandidates = getImageCandidates(currentSuggestion)
  const showEmoji = fallbackIndex >= imageCandidates.length
  const imgSrc = imageCandidates[fallbackIndex]

  return (
    <>
      <div
        ref={cardRef}
        role="article"
        aria-label={`${currentSuggestion} suggestion. Use left/right arrow keys or swipe to skip or add.`}
        tabIndex={0}
        className="relative h-72 cursor-grab active:cursor-grabbing select-none touch-none focus:outline-2 focus:outline-green-700 rounded-2xl"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') { e.preventDefault(); onAdd('exploring') }
          if (e.key === 'ArrowLeft')  { e.preventDefault(); onSkip() }
        }}
      >
        <div
          ref={cardInnerRef}
          className={`absolute inset-0 rounded-2xl border shadow-lg overflow-hidden flex flex-col ${cardSurface}`}
          style={{ willChange: 'transform' }}
        >
          <div className={`relative w-full flex-1 flex items-center justify-center overflow-hidden ${dm ? 'bg-stone-700' : 'bg-stone-100'}`}>
            {!showEmoji
              ? <Image
                  key={`${currentSuggestion}-${fallbackIndex}`}
                  src={imgSrc}
                  alt={currentSuggestion}
                  fill
                  sizes="(max-width: 640px) 100vw, 448px"
                  className="object-cover"
                  onError={handleImageError}
                />
              : <span className="text-7xl">🍽️</span>
            }
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            {suggestionData && (
              <CardBadge side="left" tone="green">
                <FoodTypeIcon name={FOOD_TYPE_CONFIG[suggestionData.foodType].iconName} className="w-3.5 h-3.5" />{FOOD_TYPE_CONFIG[suggestionData.foodType].label}
              </CardBadge>
            )}
            {hint && (
              <CardBadge side="right" tone="amber">
                {hint}
              </CardBadge>
            )}
            <span className="absolute bottom-3 left-0 right-0 text-center text-white font-bold text-xl drop-shadow-lg px-4">
              {currentSuggestion}
            </span>
          </div>
        </div>
        {swipeDir === 'right' && <SwipeOverlay tone="add" label="✓ Try it!" />}
        {swipeDir === 'left' && <SwipeOverlay tone="skip" label="→ Skip" />}
      </div>

      {exampleRecipe && (
        <p className={`text-xs text-center mt-2 ${dm ? 'text-green-300/80' : 'text-green-800/80'}`}>✨ Try: {exampleRecipe.title}</p>
      )}

      <div className="flex items-center justify-around mt-6 px-8">
        <CircleActionButton onClick={onSkip} symbol="→" caption="Skip" variant="secondary" dm={dm} />
        <CircleActionButton onClick={() => onAdd('exploring')} symbol="✓" caption="Try it!" variant="primary" dm={dm} />
      </div>
    </>
  )
}
