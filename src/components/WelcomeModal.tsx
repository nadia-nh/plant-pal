'use client'

import { useState, useEffect } from 'react'
import { FoodType, DietaryTag } from '@/lib/types'
import { ModalShell } from './ModalShell'

export interface OnboardingFood {
  name: string
  foodType: FoodType
  emoji: string
}

const ONBOARDING_FOODS: OnboardingFood[] = [
  { name: 'Broccoli',      foodType: 'vegetable', emoji: '🥦' },
  { name: 'Spinach',       foodType: 'vegetable', emoji: '🥬' },
  { name: 'Kale',          foodType: 'vegetable', emoji: '🥬' },
  { name: 'Mushrooms',     foodType: 'vegetable', emoji: '🍄' },
  { name: 'Carrots',       foodType: 'vegetable', emoji: '🥕' },
  { name: 'Tomatoes',      foodType: 'vegetable', emoji: '🍅' },
  { name: 'Sweet Potato',  foodType: 'vegetable', emoji: '🍠' },
  { name: 'Avocado',       foodType: 'vegetable', emoji: '🥑' },
  { name: 'Cauliflower',   foodType: 'vegetable', emoji: '🥦' },
  { name: 'Bell Peppers',  foodType: 'vegetable', emoji: '🫑' },
  { name: 'Corn',          foodType: 'vegetable', emoji: '🌽' },
  { name: 'Peas',          foodType: 'vegetable', emoji: '🫛' },
  { name: 'Cucumber',      foodType: 'vegetable', emoji: '🥒' },
  { name: 'Zucchini',      foodType: 'vegetable', emoji: '🥬' },
  { name: 'Rice',          foodType: 'grain',     emoji: '🍚' },
  { name: 'Pasta',         foodType: 'grain',     emoji: '🍝' },
  { name: 'Oats',          foodType: 'grain',     emoji: '🥣' },
  { name: 'Bread',         foodType: 'other',     emoji: '🍞' },
  { name: 'Quinoa',        foodType: 'grain',     emoji: '🌾' },
  { name: 'Lentils',       foodType: 'legume',    emoji: '🫘' },
  { name: 'Chickpeas',     foodType: 'legume',    emoji: '🫘' },
  { name: 'Black Beans',   foodType: 'legume',    emoji: '🫘' },
  { name: 'Edamame',       foodType: 'legume',    emoji: '🫛' },
  { name: 'Tofu',          foodType: 'legume',    emoji: '🧊' },
  { name: 'Almonds',       foodType: 'other',     emoji: '🥜' },
  { name: 'Walnuts',       foodType: 'other',     emoji: '🥜' },
]

const BARRIERS = [
  { id: 'planning',  label: 'Knowing what to cook', emoji: '🗓' },
  { id: 'texture',   label: 'Texture issues',       emoji: '🤢' },
  { id: 'unknown',   label: 'Where to start',       emoji: '🤷' },
  { id: 'overwhelm', label: 'Feels overwhelming',   emoji: '😵' },
  { id: 'family',    label: 'Family preferences',   emoji: '👨‍👩‍👧' },
  { id: 'time',      label: 'Takes too long',        emoji: '⏱' },
  { id: 'bland',     label: 'Tastes bland',          emoji: '😐' },
  { id: 'cost',      label: 'Seems expensive',       emoji: '💸' },
]

const DIETARY_OPTIONS: { tag: DietaryTag; label: string }[] = [
  { tag: 'gluten-free', label: 'Gluten-free' },
  { tag: 'nut-free',    label: 'Nut-free'    },
  { tag: 'soy-free',    label: 'Soy-free'    },
  { tag: 'oil-free',    label: 'Oil-free'    },
]

interface WelcomeModalProps {
  open: boolean
  onComplete: (selectedFoods: OnboardingFood[], barriers: string[], dietaryTags: DietaryTag[]) => void
  onSkip: () => void
}

export function WelcomeModal({ open, onComplete, onSkip }: WelcomeModalProps) {
  const [step, setStep] = useState(0)
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([])

  useEffect(() => {
    if (open) {
      setStep(0)
      setSelectedFoods([])
      setSelectedBarriers([])
      setSelectedDietary([])
    }
  }, [open])

  const toggleFood = (name: string) => {
    setSelectedFoods(prev => {
      if (prev.includes(name)) return prev.filter(f => f !== name)
      if (prev.length >= 5) return prev
      return [...prev, name]
    })
  }

  const toggleBarrier = (id: string) =>
    setSelectedBarriers(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])

  const toggleDietary = (tag: DietaryTag) =>
    setSelectedDietary(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const handleComplete = () => {
    const foods = ONBOARDING_FOODS.filter(f => selectedFoods.includes(f.name))
    onComplete(foods, selectedBarriers, selectedDietary)
  }

  return (
    <ModalShell open={open} titleId="welcome-modal-title" maxWidth="md" scrollable="90vh" onEscape={() => { if (step >= 2) onSkip() }}>
        {/* Step progress dots (steps 1–3 only) */}
        {step > 0 && (
          <div className="flex justify-center gap-1.5 mb-5">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-all duration-300 ${n <= step ? 'w-6 bg-green-800' : 'w-1.5 bg-stone-200'}`}
              />
            ))}
          </div>
        )}

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center space-y-4">
            <div className="text-5xl">🌱</div>
            <div>
              <h2
                id="welcome-modal-title"
                className="text-2xl font-bold text-green-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Welcome to Plant Pal
              </h2>
              <p className="text-sm text-stone-500 mt-2">
                A gentle guide to exploring plant-based foods at your own pace.
              </p>
            </div>
            <p className="text-sm text-stone-600">
              Let&apos;s set up your personal plate — it takes about 30 seconds.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl text-sm font-medium bg-green-800 text-white hover:bg-green-900 transition-colors"
            >
              Let&apos;s get started →
            </button>
            <button
              onClick={onSkip}
              className="text-xs text-stone-400 hover:text-stone-600 underline"
            >
              Skip setup
            </button>
          </div>
        )}

        {/* Step 1: Food selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 id="welcome-modal-title" className="text-lg font-semibold text-green-900">
                Which of these do you already enjoy?
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Pick 2–5 foods you know and like
                {selectedFoods.length > 0 && (
                  <span className="ml-2 font-medium text-green-800">
                    ({selectedFoods.length}/5)
                  </span>
                )}
              </p>
            </div>
            <div className="overflow-y-auto max-h-52 -mx-1 px-1">
              <div className="flex flex-wrap gap-2 pb-1">
                {ONBOARDING_FOODS.map(food => {
                  const selected = selectedFoods.includes(food.name)
                  const maxed = selectedFoods.length >= 5 && !selected
                  return (
                    <button
                      key={food.name}
                      onClick={() => toggleFood(food.name)}
                      disabled={maxed}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-colors ${
                        selected
                          ? 'bg-green-800 text-white border-green-800'
                          : maxed
                          ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-green-700/50 hover:text-green-900'
                      }`}
                    >
                      <span aria-hidden="true">{food.emoji}</span>
                      <span>{food.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setStep(2)}
                disabled={selectedFoods.length < 2}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-green-800 text-white hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
              <button
                onClick={onSkip}
                className="w-full text-xs text-stone-400 hover:text-stone-600 py-1"
              >
                Skip setup
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Barriers */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 id="welcome-modal-title" className="text-lg font-semibold text-green-900">
                What makes eating more plants tricky?
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Select all that apply — or skip if nothing fits
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {BARRIERS.map(barrier => {
                const selected = selectedBarriers.includes(barrier.id)
                return (
                  <button
                    key={barrier.id}
                    onClick={() => toggleBarrier(barrier.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-colors ${
                      selected
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-green-700/50 hover:text-green-900'
                    }`}
                  >
                    <span aria-hidden="true">{barrier.emoji}</span>
                    <span>{barrier.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setStep(3)}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-green-800 text-white hover:bg-green-900 transition-colors"
              >
                Next →
              </button>
              <button
                onClick={onSkip}
                className="w-full text-xs text-stone-400 hover:text-stone-600 py-1"
              >
                Skip setup
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dietary needs */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 id="welcome-modal-title" className="text-lg font-semibold text-green-900">
                Any dietary needs?
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                We&apos;ll pre-set your filters in the Discover tab. You can always change these later.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(opt => {
                const selected = selectedDietary.includes(opt.tag)
                return (
                  <button
                    key={opt.tag}
                    onClick={() => toggleDietary(opt.tag)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selected
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-green-700/50 hover:text-green-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <div className="pt-3 border-t border-stone-200">
              <button
                onClick={handleComplete}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-green-800 text-white hover:bg-green-900 transition-colors"
              >
                Let&apos;s go! 🌱
              </button>
            </div>
          </div>
        )}
    </ModalShell>
  )
}
