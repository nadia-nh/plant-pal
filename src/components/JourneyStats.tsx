'use client'

import { Food } from '@/lib/types'

interface JourneyStatsProps {
  foods: Food[]
  darkMode: boolean
  onOpenStats: () => void
}

export function JourneyStats({ foods, darkMode, onOpenStats }: JourneyStatsProps) {
  const dm = darkMode

  const loveCount      = foods.filter(f => f.category === 'love').length
  const exploringCount = foods.filter(f => f.category === 'exploring').length
  const totalAttempts  = foods.reduce((sum, f) => sum + f.attempts, 0)

  const milestones = [
    { label: 'First attempt',  unlocked: totalAttempts  >= 1  },
    { label: 'Trying 3 foods', unlocked: exploringCount >= 3  },
    { label: '5 attempts',     unlocked: totalAttempts  >= 5  },
    { label: '5 foods loved',  unlocked: loveCount      >= 5  },
    { label: '10 attempts',    unlocked: totalAttempts  >= 10 },
    { label: '10 foods loved', unlocked: loveCount      >= 10 },
    { label: '25 attempts',    unlocked: totalAttempts  >= 25 },
  ]
  const milestone = [...milestones].reverse().find(m => m.unlocked)

  const stats = [
    { value: loveCount,      label: 'loved'     },
    { value: exploringCount, label: 'exploring' },
    { value: totalAttempts,  label: 'attempts'  },
  ]

  return (
    <div className={`max-w-5xl mx-auto px-4 mb-6`}>
      <div className={`rounded-2xl px-5 py-3 flex items-center gap-4 ${dm ? 'bg-stone-800/80 border border-stone-700/40' : 'bg-white border border-stone-200/60 shadow-sm'}`}>
        {/* Stat row */}
        <div className={`flex items-center divide-x ${dm ? 'divide-stone-700' : 'divide-stone-200'}`}>
          {stats.map(s => (
            <div key={s.label} className="px-4 first:pl-0 whitespace-nowrap">
              <span className={`font-semibold tabular-nums ${dm ? 'text-stone-200' : 'text-stone-800'}`}>{s.value}</span>
              <span className={`ml-1.5 text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
        {/* Latest milestone */}
        {milestone && (
          <span className={`hidden sm:inline text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{milestone.label}</span>
        )}
        {/* Full stats link */}
        <button
          onClick={onOpenStats}
          className={`ml-auto text-xs font-medium shrink-0 ${dm ? 'text-green-300 hover:text-green-200' : 'text-green-800 hover:text-green-900'}`}
        >
          Full stats →
        </button>
      </div>
    </div>
  )
}
