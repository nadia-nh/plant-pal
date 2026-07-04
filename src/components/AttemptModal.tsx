'use client'

import { useState, useEffect } from 'react'
import { Food, Attempt } from '@/lib/types'
import { getSuggestionsForFood } from '@/lib/foods'
import { inputField } from '@/lib/theme'
import { ModalShell } from './ModalShell'

interface AttemptModalProps {
  food: Food | null
  darkMode: boolean
  editingAttempt?: Attempt | null
  onClose: () => void
  onSubmit: (foodId: string, attempt: Attempt) => void
  onSaveEdit?: (foodId: string, attemptId: string, updates: { method: string; liked: boolean | null; notes: string }) => void
}

export function AttemptModal({ food, darkMode, editingAttempt, onClose, onSubmit, onSaveEdit }: AttemptModalProps) {
  const dm = darkMode
  const [method, setMethod] = useState('')
  const [liked, setLiked] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (food) {
      if (editingAttempt) {
        setMethod(editingAttempt.method)
        setLiked(editingAttempt.liked)
        setNotes(editingAttempt.notes)
      } else {
        const suggestion = getSuggestionsForFood(food.name)
        setMethod(suggestion?.cookingMethods[0]?.name || 'Plain')
        setLiked(null)
        setNotes('')
      }
    }
  }, [food, editingAttempt])

  const handleSubmit = () => {
    if (!food) return
    if (editingAttempt) {
      onSaveEdit?.(food.id, editingAttempt.id, { method, liked, notes })
      return
    }
    const attempt: Attempt = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      method,
      liked,
      notes,
    }
    onSubmit(food.id, attempt)
  }

  return (
    <ModalShell open={!!food} titleId="attempt-modal-title" darkMode={dm} padding="sm" onEscape={onClose}>
      {food && (
        <>
        <h3 id="attempt-modal-title" className={`font-semibold text-lg mb-4 ${dm ? 'text-stone-200' : 'text-stone-800'}`}>{editingAttempt ? 'Edit attempt' : 'Log attempt'}: {food.name}</h3>
        <div className="mb-3">
          <label htmlFor="attempt-method" className={`block text-sm font-medium mb-1 ${dm ? 'text-stone-300' : 'text-stone-700'}`}>How did you try it?</label>
          <input id="attempt-method" type="text" value={method} onChange={e => setMethod(e.target.value)} className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 ${inputField(dm)}`} />
        </div>
        <div className="mb-3">
          <label className={`block text-sm font-medium mb-2 ${dm ? 'text-stone-300' : 'text-stone-700'}`}>Did you like it?</label>
          <div className="flex gap-2">
            <button onClick={() => setLiked(true)}  className={`flex-1 py-2 rounded-xl border ${liked === true  ? 'bg-green-800 text-white border-green-800' : (dm ? 'border-stone-600 text-stone-400' : 'border-stone-300 text-stone-600')}`}>✓ Liked</button>
            <button onClick={() => setLiked(false)} className={`flex-1 py-2 rounded-xl border ${liked === false ? 'bg-red-500 text-white border-red-500'   : (dm ? 'border-stone-600 text-stone-400' : 'border-stone-300 text-stone-600')}`}>✕ Not yet</button>
            <button onClick={() => setLiked(null)}  className={`flex-1 py-2 rounded-xl border ${liked === null  ? 'bg-stone-500 text-white border-stone-500' : (dm ? 'border-stone-600 text-stone-400' : 'border-stone-300 text-stone-600')}`}>? Not sure</button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="attempt-notes" className={`block text-sm font-medium mb-1 ${dm ? 'text-stone-300' : 'text-stone-700'}`}>Notes</label>
          <textarea id="attempt-notes" value={notes} onChange={e => setNotes(e.target.value)} className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 ${inputField(dm)}`} rows={2} />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className={`flex-1 py-2 border rounded-xl ${dm ? 'border-stone-600 text-stone-400' : 'border-stone-300 text-stone-600'}`}>Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2 bg-green-800 hover:bg-green-900 text-white rounded-xl">{editingAttempt ? 'Save changes' : 'Save'}</button>
        </div>
        </>
      )}
    </ModalShell>
  )
}
