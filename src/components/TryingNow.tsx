'use client'

import { useState, useRef, useEffect } from 'react'
import { Food, FoodCategory } from '@/lib/types'
import { ATTEMPT_GOAL, DRAG_CLICK_THRESHOLD, PROGRESS_RING } from '@/lib/constants'

interface TryingNowProps {
  exploringFoods: Food[]
  allFoodNames: string[]
  darkMode: boolean
  onAddFood: (name: string, category: FoodCategory) => void
  onDeleteFood: (id: string) => void
  onSelectFood: (food: Food) => void
  onLogAttempt: (food: Food) => void
  onMoveToPlate: (food: Food) => void
}

export function TryingNow({ exploringFoods, allFoodNames, darkMode, onAddFood, onDeleteFood, onSelectFood, onLogAttempt, onMoveToPlate }: TryingNowProps) {
  const [input, setInput] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ food: Food; startX: number; startY: number; curX: number; curY: number } | null>(null)
  const [dragGhost, setDragGhost] = useState<{ x: number; y: number; food: Food } | null>(null)
  const dm = darkMode

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      drag.curX = e.clientX
      drag.curY = e.clientY
      const dist = Math.sqrt((drag.curX - drag.startX) ** 2 + (drag.curY - drag.startY) ** 2)
      if (dist >= DRAG_CLICK_THRESHOLD) {
        setDragGhost({ x: e.clientX, y: e.clientY, food: drag.food })
      }
    }
    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const dist = Math.sqrt((drag.curX - drag.startX) ** 2 + (drag.curY - drag.startY) ** 2)
      if (dist >= DRAG_CLICK_THRESHOLD) {
        const rect = containerRef.current?.getBoundingClientRect()
        const insidePanel = rect
          ? e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
          : false
        if (!insidePanel) onMoveToPlate(drag.food)
      }
      dragRef.current = null
      setDragGhost(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [onMoveToPlate])

  const filtered = allFoodNames.filter(n =>
    n.toLowerCase().includes(input.toLowerCase()) &&
    !exploringFoods.some(f => f.name.toLowerCase() === n.toLowerCase())
  ).slice(0, 6)

  // Circumference of ring (r=10): 2π*10 ≈ 62.8
  const ringCircumference = 62.8

  return (
    <>
      {dragGhost && (
        <div
          style={{ position: 'fixed', left: dragGhost.x, top: dragGhost.y, transform: 'translate(-50%, -60%)', pointerEvents: 'none', zIndex: 1000 }}
          className="bg-white rounded-xl px-3 py-1.5 shadow-xl border border-green-700/30 text-sm font-semibold text-green-800 whitespace-nowrap"
        >
          {dragGhost.food.name} → 🍽️
        </div>
      )}
    <div ref={containerRef} className={`w-full lg:w-72 p-4 rounded-3xl shadow-sm border ${dm ? 'bg-stone-800/90 border-stone-700/50' : 'bg-white/90 border-stone-200/60'} backdrop-blur-sm`}>
      <h2 className={`text-base font-bold italic mb-3 ${dm ? 'text-green-300' : 'text-green-900'}`} style={{ fontFamily: 'var(--font-display)' }}>Trying Now</h2>

      {exploringFoods.length === 0 && (
        <p className={`text-sm mb-4 ${dm ? 'text-stone-500' : 'text-stone-400'}`}>Add foods you&apos;re experimenting with here!</p>
      )}

      <ul className="space-y-1 mb-3">
        {exploringFoods.map(food => (
          <li
            key={food.id}
            style={{ cursor: dragGhost?.food.id === food.id ? 'grabbing' : 'grab', touchAction: 'none' }}
            className={`group flex items-center gap-2 px-2 py-1.5 rounded-xl transition-transform hover:translate-x-1 ${dm ? 'hover:bg-stone-700/50' : 'hover:bg-stone-100/80'} ${dragGhost?.food.id === food.id ? 'opacity-40' : ''}`}
            onPointerDown={e => {
              e.preventDefault()
              dragRef.current = { food, startX: e.clientX, startY: e.clientY, curX: e.clientX, curY: e.clientY }
            }}
          >
            <button
              onClick={() => { if (!dragGhost) onSelectFood(food) }}
              className={`flex-1 text-left text-sm font-medium truncate ${dm ? 'text-stone-200 hover:text-green-300' : 'text-stone-700 hover:text-green-800'}`}
            >
              {food.name}
            </button>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="relative w-7 h-7">
                <svg className="w-7 h-7 -rotate-90">
                  <circle cx="14" cy="14" r="10" stroke={dm ? PROGRESS_RING.track.dark : PROGRESS_RING.track.light} strokeWidth="2.5" fill="none" />
                  <circle cx="14" cy="14" r="10" stroke={dm ? PROGRESS_RING.bar.dark : PROGRESS_RING.bar.light} strokeWidth="2.5" fill="none" strokeLinecap="round"
                    strokeDasharray={`${Math.min(food.attempts, ATTEMPT_GOAL) * (ringCircumference / ATTEMPT_GOAL)} ${ringCircumference}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${dm ? 'text-stone-300' : 'text-stone-600'}`}>{food.attempts}</span>
              </div>
              <span className={`text-xs ${dm ? 'text-stone-600' : 'text-stone-400'}`}>/{ATTEMPT_GOAL}</span>
              <button onClick={() => onLogAttempt(food)} className={`text-base font-bold leading-none px-1 ${dm ? 'text-green-300 hover:text-green-200' : 'text-green-800 hover:text-green-900'}`}>+</button>
              <button onClick={() => onDeleteFood(food.id)} className={`text-xs px-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${dm ? 'text-stone-500 hover:text-red-400' : 'text-stone-400 hover:text-red-500'}`}>✕</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative">
        <input
          type="text"
          value={input}
          placeholder="Add food to try…"
          aria-label="Add food to try"
          role="combobox"
          aria-expanded={showAutocomplete && filtered.length > 0}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="trying-now-autocomplete"
          className={`w-full px-3 py-2 text-sm border rounded-2xl focus:outline-none focus:ring-1 shadow-sm transition-all ${dm ? 'bg-stone-800 border-stone-600 text-stone-200 placeholder-stone-500 focus:border-green-500/50 focus:ring-green-500/30' : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-green-700/50 focus:ring-green-700/30'}`}
          onChange={e => {
            setInput(e.target.value)
            setShowAutocomplete(e.target.value.length > 0)
          }}
          onFocus={() => { if (input.length > 0) setShowAutocomplete(true) }}
          onBlur={() => { setTimeout(() => setShowAutocomplete(false), 200) }}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              onAddFood(input.trim(), 'exploring')
              setInput('')
            } else if (e.key === 'Escape') {
              setShowAutocomplete(false)
            }
          }}
        />
        {showAutocomplete && filtered.length > 0 && (
          <ul id="trying-now-autocomplete" role="listbox" aria-label="Food suggestions" className={`absolute z-20 w-full border rounded-xl shadow-lg max-h-36 overflow-y-auto bottom-full mb-1 list-none p-0 m-0 ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
            {filtered.map(name => (
              <li key={name} role="option" aria-selected={false}>
                <button
                  className={`w-full text-left px-3 py-1.5 text-sm focus:outline-none transition-colors ${dm ? 'text-stone-200 hover:bg-stone-700 focus:bg-stone-700' : 'text-stone-700 hover:bg-stone-50 focus:bg-stone-50'}`}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    onAddFood(name, 'exploring')
                    setInput('')
                    setShowAutocomplete(false)
                  }}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  )
}
