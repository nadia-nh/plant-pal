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
    { label: '🎉 First attempt!',  unlocked: totalAttempts  >= 1  },
    { label: '🌱 Trying 3 foods!', unlocked: exploringCount >= 3  },
    { label: '⭐ 5 attempts!',      unlocked: totalAttempts  >= 5  },
    { label: '🥦 5 foods loved!',  unlocked: loveCount      >= 5  },
    { label: '🌟 10 attempts!',     unlocked: totalAttempts  >= 10 },
    { label: '🏆 10 foods loved!', unlocked: loveCount      >= 10 },
    { label: '🚀 25 attempts!',     unlocked: totalAttempts  >= 25 },
  ]
  const milestone = [...milestones].reverse().find(m => m.unlocked)

  const stats = [
    { emoji: '🟢', value: loveCount,      label: 'loved'      },
    { emoji: '🌱', value: exploringCount, label: 'exploring'  },
    { emoji: '✓',  value: totalAttempts,  label: 'attempts'   },
  ]

  return (
    <div className={`max-w-5xl mx-auto px-4 mb-6`}>
      <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${dm ? 'bg-gray-800' : 'bg-white border border-gray-100 shadow-sm'}`}>
        {/* Stat pills */}
        <div className="flex gap-3 flex-1 flex-wrap">
          {stats.map(s => (
            <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${dm ? 'bg-gray-700' : 'bg-green-50'}`}>
              <span className="text-base leading-none">{s.emoji}</span>
              <span className={`font-semibold ${dm ? 'text-green-300' : 'text-green-800'}`}>{s.value}</span>
              <span className={`text-xs ${dm ? 'text-gray-400' : 'text-green-700'}`}>{s.label}</span>
            </div>
          ))}
          {/* Milestone badge */}
          {milestone && (
            <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
              {milestone.label}
            </div>
          )}
        </div>
        {/* Full stats link */}
        <button
          onClick={onOpenStats}
          className={`text-xs font-medium shrink-0 ${dm ? 'text-green-400 hover:text-green-300' : 'text-green-700 hover:text-green-900'}`}
        >
          Full stats →
        </button>
      </div>
    </div>
  )
}
