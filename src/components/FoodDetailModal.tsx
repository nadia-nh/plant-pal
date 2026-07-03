'use client'

import { useEffect, useRef } from 'react'
import { Food, FoodCategory, Attempt } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { getSuggestionsForFood } from '@/lib/foods'

interface FoodDetailModalProps {
  food: Food | null
  darkMode: boolean
  onClose: () => void
  onMove: (food: Food, cat: FoodCategory) => void
  onEditAttempt: (food: Food, attempt: Attempt) => void
  onDeleteAttempt: (foodId: string, attemptId: string) => void
}

export function FoodDetailModal({ food, darkMode, onClose, onMove, onEditAttempt, onDeleteAttempt }: FoodDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const dm = darkMode

  useEffect(() => {
    if (food) dialogRef.current?.focus()
  }, [food])

  if (!food) return null

  const suggestion = getSuggestionsForFood(food.name)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4" onClick={onClose}
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="food-detail-title" tabIndex={-1}
        className={`rounded-2xl p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto focus:outline-none ${dm ? 'bg-stone-800' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 id="food-detail-title" className={`text-lg font-semibold ${dm ? 'text-stone-200' : 'text-stone-800'}`}>{food.name}</h3>
          <div className="flex gap-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { onMove(food, cat); onClose() }}
                className={`text-xs px-2 py-1 rounded ${food.category === cat ? 'bg-green-800 text-white' : (dm ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200')}`}
              >
                {cat === 'love' ? '🟢' : cat === 'exploring' ? '🌱' : cat === 'curious' ? '🌿' : '🚫'}
              </button>
            ))}
          </div>
        </div>
        {suggestion && (
          <>
            <p className={`text-sm mb-3 ${dm ? 'text-stone-400' : 'text-stone-600'}`}>Similar to: {suggestion.similarTo.join(', ')}</p>
            {food.category === 'exploring' && (() => {
              const easyMethod = suggestion.cookingMethods.find(m => m.difficulty === 'easy') ?? suggestion.cookingMethods[0]
              const tip = easyMethod?.tips[0]
              if (!tip) return null
              return (
                <div className={`rounded-xl p-3 mb-3 text-sm border ${dm ? 'bg-stone-700/60 border-stone-600 text-green-300' : 'bg-stone-50 border-stone-200 text-green-900'}`}>
                  <span className="font-medium">Quick tip:</span> {tip}
                </div>
              )
            })()}
            <h4 className={`font-medium mb-2 ${dm ? 'text-stone-200' : 'text-stone-800'}`}>Cooking methods:</h4>
            <ul className="space-y-2 mb-4">
              {suggestion.cookingMethods.map((method, i) => (
                <li key={i} className={`text-sm p-2 rounded ${dm ? 'bg-stone-700/50 text-stone-200' : 'bg-stone-50'}`}>
                  <span className="font-medium">{method.name}</span>
                  <span className={`ml-2 px-1 rounded text-xs ${method.difficulty === 'easy' ? (dm ? 'bg-green-300/10 text-green-300' : 'bg-green-800/10 text-green-800') : method.difficulty === 'medium' ? (dm ? 'bg-amber-300/10 text-amber-300' : 'bg-amber-700/10 text-amber-800') : (dm ? 'bg-red-300/10 text-red-300' : 'bg-red-700/10 text-red-700')}`}>
                    {method.difficulty}
                  </span>
                  <p className={`text-xs mt-0.5 ${dm ? 'text-stone-400' : 'text-stone-600'}`}>{method.description}</p>
                  {method.tips.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {method.tips.map((tip, j) => (
                        <li key={j} className={`text-xs flex gap-1.5 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>
                          <span className={`mt-0.5 shrink-0 ${dm ? 'text-green-400' : 'text-green-700'}`}>›</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <h4 className={`font-medium mb-2 ${dm ? 'text-stone-200' : 'text-stone-800'}`}>Easy meals:</h4>
            <div className="flex flex-wrap gap-1 mb-4">
              {suggestion.easyMeals.map((meal, i) => (
                <span key={i} className={`px-2 py-1 border rounded-full text-xs ${dm ? 'bg-stone-700 border-stone-600 text-stone-300' : 'bg-stone-100 border-stone-200 text-stone-700'}`}>{meal}</span>
              ))}
            </div>
          </>
        )}
        {food.attemptHistory.length > 0 && (
          <>
            <h4 className={`font-medium mb-2 ${dm ? 'text-stone-200' : 'text-stone-800'}`}>Your attempts:</h4>
            <ul className="space-y-1 mb-4">
              {[...food.attemptHistory].reverse().map(attempt => (
                <li key={attempt.id} className={`text-xs p-2 rounded flex items-start gap-1.5 group ${dm ? 'bg-stone-700/50 text-stone-200' : 'bg-stone-50'}`}>
                  <span className="flex-1 min-w-0">
                    <span className={dm ? 'text-stone-400' : 'text-stone-500'}>{attempt.date}</span> — {attempt.method}
                    {attempt.liked === true  && <span className={`ml-1 ${dm ? 'text-green-400' : 'text-green-700'}`}>✓</span>}
                    {attempt.liked === false && <span className="text-red-500 ml-1">✕</span>}
                    {attempt.notes && <span className={`ml-1 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>· {attempt.notes}</span>}
                  </span>
                  <span className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditAttempt(food, attempt)}
                      aria-label={`Edit attempt from ${attempt.date}`}
                      className={`px-0.5 ${dm ? 'text-stone-500 hover:text-green-400' : 'text-stone-400 hover:text-green-700'}`}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDeleteAttempt(food.id, attempt.id)}
                      aria-label={`Delete attempt from ${attempt.date}`}
                      className={`px-0.5 ${dm ? 'text-stone-500 hover:text-red-400' : 'text-stone-400 hover:text-red-500'}`}
                    >
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        <button onClick={onClose} className={`w-full py-2 rounded-xl ${dm ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>Close</button>
      </div>
    </div>
  )
}
