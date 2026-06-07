'use client'

import { recipes } from '@/lib/recipes'

interface RecipeBrowserProps {
  darkMode: boolean
  recipeFilter: string
  onFilterChange: (cat: string) => void
  barriers?: string[]
}

export function RecipeBrowser({ darkMode, recipeFilter, onFilterChange, barriers = [] }: RecipeBrowserProps) {
  const dm = darkMode
  const recipeCategories = ['all', ...Array.from(new Set(recipes.map(r => r.category)))]
  const showQuickHint = barriers.some(b => ['time', 'cost', 'overwhelm'].includes(b))

  return (
    <section className="max-w-6xl mx-auto px-4 pb-8">
      <h2 className={`text-2xl font-bold italic mb-1 ${dm ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontFamily: 'var(--font-display)' }}>
        Recipes
      </h2>
      <p className={`text-sm mb-4 ${dm ? 'text-gray-500' : 'text-stone-400'}`}>{recipes.length} plant-based recipes</p>
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <button onClick={() => onFilterChange('quick')}
          className={`inline-flex items-center leading-none px-2.5 py-1 rounded-full text-xs font-medium ${recipeFilter === 'quick' ? 'bg-amber-500 text-white' : dm ? 'bg-amber-900/40 text-amber-300 hover:bg-amber-900/60' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
        >
          ⚡ Quick &amp; easy
        </button>
        {showQuickHint && (
          <span className={`text-[11px] italic ${dm ? 'text-amber-300/80' : 'text-amber-700/80'}`}>✨ Picked for you</span>
        )}
        {recipeCategories.map(cat => (
          <button key={cat} onClick={() => onFilterChange(cat)}
            className={`inline-flex items-center leading-none px-2.5 py-1 rounded-full text-xs ${recipeFilter === cat ? 'bg-green-900 text-white' : dm ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-stone-100 text-gray-700 hover:bg-stone-200'}`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {recipes.filter(r => recipeFilter === 'all' || (recipeFilter === 'quick' ? r.difficulty === 'easy' : r.category === recipeFilter)).map((recipe, idx) => (
          <a
            key={idx}
            href={recipe.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-xl shadow hover:shadow-lg transition-shadow block group aspect-[4/3]"
          >
            <img
              src={recipe.image || '/placeholder-vegetable.svg'}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder-vegetable.svg' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute top-2 left-2 inline-flex items-center bg-green-900/80 text-white text-[10px] px-2 py-1 rounded-full font-medium leading-none">
              {recipe.source}
            </span>
            {recipe.difficulty && (
              <span className="absolute top-2 right-2 inline-flex items-center bg-black/50 text-white text-[10px] px-2 py-1 rounded-full leading-none">
                {recipe.difficulty}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{recipe.title}</p>
              {recipe.prepTime && (
                <p className="text-white/70 text-[10px] mt-0.5">⏱ {recipe.prepTime}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
