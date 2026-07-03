'use client'

import { useRef, useState, useEffect } from 'react'
import { Food, FoodCategory } from '@/lib/types'
import {
  PLATE_CX, PLATE_CY, PLATE_R, PLATE_INNER_R, PLATE_RIM_WIDTH,
  DRAG_CLICK_THRESHOLD, FOOD_TYPE_CONFIG, FOOD_TYPES,
} from '@/lib/constants'
import { getAllSuggestedFoods } from '@/lib/foods'
import { FoodTypeIcon } from '@/lib/foodIcons'

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function makeSectorPath(cx: number, cy: number, outerR: number, innerR: number, startDeg: number, endDeg: number): string {
  const oS = polarToXY(cx, cy, outerR, startDeg)
  const oE = polarToXY(cx, cy, outerR, endDeg)
  const iS = polarToXY(cx, cy, innerR, startDeg)
  const iE = polarToXY(cx, cy, innerR, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${iS.x} ${iS.y} L ${oS.x} ${oS.y} A ${outerR} ${outerR} 0 ${large} 1 ${oE.x} ${oE.y} L ${iE.x} ${iE.y} A ${innerR} ${innerR} 0 ${large} 0 ${iS.x} ${iS.y} Z`
}

const CHIP_HEIGHT = 20
function chipDisplayName(name: string): string {
  return name.length <= 12 ? name : name.slice(0, 11) + '…'
}

function chipWidth(name: string): number {
  return 18 + chipDisplayName(name).length * 5.6
}

// Slide a chip horizontally so it stays between the plate rim and the
// vertical sector divider; rows keep their height so chips never pile up
function clampChipPos(pos: { x: number; y: number }, w: number): { x: number; y: number } {
  const margin = PLATE_R - 10
  const dx = pos.x - PLATE_CX
  const dy = pos.y - PLATE_CY
  const chord = Math.sqrt(Math.max(margin * margin - dy * dy, 0))
  const rimMax = chord - w / 2
  const dividerMin = w / 2 + 4
  const xAbs = rimMax < dividerMin
    ? Math.max(rimMax, 0)
    : Math.min(Math.max(Math.abs(dx), dividerMin), rimMax)
  return { x: PLATE_CX + Math.sign(dx || 1) * xAbs, y: pos.y }
}

// Chips stack at evenly spaced heights within their quarter-wedge, centered
// between the vertical divider and the rim at each height — horizontal
// capsules read as neat rows and never cross into a neighboring sector
function getFoodCirclePositions(count: number, startDeg: number, endDeg: number, cx: number, cy: number): Array<{x: number; y: number}> {
  if (count === 0) return []
  const midRad = (((startDeg + endDeg) / 2) * Math.PI) / 180
  const signX = Math.cos(midRad) < 0 ? -1 : 1
  const signY = Math.sin(midRad) < 0 ? -1 : 1
  const midDy = 102
  const spacing = 23
  const half = count === 1 ? 0 : Math.min(47, (spacing * (count - 1)) / 2)
  const margin = PLATE_R - 10
  const positions: Array<{x: number; y: number}> = []
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1)
    const absDy = midDy - half + 2 * half * t
    const chord = Math.sqrt(Math.max(margin * margin - absDy * absDy, 0))
    positions.push({ x: cx + signX * chord * 0.55, y: cy + signY * absDy })
  }
  return positions
}

interface PlateProps {
  loveFoods: Food[]
  darkMode: boolean
  onAddFood: (name: string, category: FoodCategory) => void
  onMoveFood: (food: Food, cat: FoodCategory) => void
  onDeleteFood: (id: string) => void
  onSelectFood: (food: Food) => void
}

export function Plate({ loveFoods, darkMode, onAddFood, onMoveFood, onDeleteFood, onSelectFood }: PlateProps) {
  const plateRef = useRef<SVGSVGElement>(null)
  const plateDragRef = useRef<{ food: Food; startX: number; startY: number; curX: number; curY: number; outside: boolean } | null>(null)
  const [plateDragGhost, setPlateDragGhost] = useState<{ svgX: number; svgY: number; outside: boolean; foodId: string } | null>(null)
  const [platePopover, setPlatePopover] = useState<{ food: Food; x: number; y: number } | null>(null)
  const [plateInput, setPlateInput] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const allFoodNames = getAllSuggestedFoods()
  const dm = darkMode

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = plateDragRef.current
      if (!drag || !plateRef.current) return
      drag.curX = e.clientX
      drag.curY = e.clientY
      const rect = plateRef.current.getBoundingClientRect()
      const svgX = (e.clientX - rect.left) / rect.width * 400
      const svgY = (e.clientY - rect.top) / rect.height * 400
      const outside = Math.sqrt((svgX - PLATE_CX) ** 2 + (svgY - PLATE_CY) ** 2) > PLATE_R + PLATE_RIM_WIDTH
      drag.outside = outside
      setPlateDragGhost({ svgX, svgY, outside, foodId: drag.food.id })
    }
    const onUp = () => {
      const drag = plateDragRef.current
      if (!drag) return
      const dist = Math.sqrt((drag.curX - drag.startX) ** 2 + (drag.curY - drag.startY) ** 2)
      if (dist < DRAG_CLICK_THRESHOLD) {
        setPlatePopover({ food: drag.food, x: drag.curX, y: drag.curY })
      } else if (drag.outside) {
        onDeleteFood(drag.food.id)
      }
      plateDragRef.current = null
      setPlateDragGhost(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [onDeleteFood])

  const filtered = allFoodNames.filter(n =>
    n.toLowerCase().includes(plateInput.toLowerCase()) &&
    !loveFoods.some(f => f.name.toLowerCase() === n.toLowerCase())
  ).slice(0, 6)

  return (
    <div className="flex-1">
      <svg ref={plateRef} viewBox="-30 -30 460 460" className="w-full max-w-sm mx-auto drop-shadow-xl" style={{ touchAction: 'none' }}
        role="img" aria-label={`Your plate with ${loveFoods.length} food${loveFoods.length !== 1 ? 's' : ''}. Drag a food off the plate to remove it.`}
      >
        <defs>
          <radialGradient id="rimGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor={dm ? '#57534e' : '#fafaf9'} />
            <stop offset="60%"  stopColor={dm ? '#44403c' : '#e7e5e4'} />
            <stop offset="100%" stopColor={dm ? '#292524' : '#d6d3d1'} />
          </radialGradient>
          <radialGradient id="plateGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%"   stopColor={dm ? '#44403c' : '#ffffff'} />
            <stop offset="80%" stopColor={dm ? '#292524' : '#fafaf9'} />
            <stop offset="100%" stopColor={dm ? '#1c1917' : '#e7e5e4'} />
          </radialGradient>
          <radialGradient id="sectorOverlay" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="80%" stopColor="transparent" />
            <stop offset="100%" stopColor={dm ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'} />
          </radialGradient>
          <filter id="plateShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor={dm ? '#000000' : '#78716c'} floodOpacity="0.25"/>
          </filter>
          <filter id="ghostShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.3" />
          </filter>
        </defs>

        <circle
          cx={PLATE_CX} cy={PLATE_CY} r={PLATE_R + PLATE_RIM_WIDTH}
          fill={plateDragGhost?.outside ? '#fca5a5' : 'url(#rimGrad)'}
          filter={plateDragGhost?.outside ? undefined : 'url(#plateShadow)'}
        />
        {!dm && !plateDragGhost?.outside && (() => {
          const hStart = polarToXY(PLATE_CX, PLATE_CY, PLATE_R + 10, 210)
          const hEnd   = polarToXY(PLATE_CX, PLATE_CY, PLATE_R + 10, 300)
          return (
            <path
              d={`M ${hStart.x} ${hStart.y} A ${PLATE_R + 10} ${PLATE_R + 10} 0 0 1 ${hEnd.x} ${hEnd.y}`}
              fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.6"
              filter="blur(2px)"
            />
          )
        })()}
        <circle cx={PLATE_CX} cy={PLATE_CY} r={PLATE_R} fill="url(#plateGrad)" />

        {FOOD_TYPES.map(ft => {
          const cfg = FOOD_TYPE_CONFIG[ft]
          const sectorFoods = loveFoods.filter(f => f.foodType === ft)
          const positions = getFoodCirclePositions(sectorFoods.length, cfg.startDeg, cfg.endDeg, PLATE_CX, PLATE_CY)
          const midAngle = (cfg.startDeg + cfg.endDeg) / 2
          const labelPos = polarToXY(PLATE_CX, PLATE_CY, 242, midAngle)
          return (
            <g key={ft}>
              <path d={makeSectorPath(PLATE_CX, PLATE_CY, PLATE_R, PLATE_INNER_R, cfg.startDeg, cfg.endDeg)} fill={dm ? cfg.fillDark : cfg.fill} stroke={dm ? 'rgba(0,0,0,0.35)' : 'white'} strokeWidth="2.5" strokeOpacity="0.9" />
              <foreignObject x={labelPos.x - 12} y={labelPos.y - 21} width={24} height={24}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <FoodTypeIcon name={cfg.iconName} className="w-5 h-5" style={{ color: dm ? cfg.strokeDark : cfg.stroke }} />
                </div>
              </foreignObject>
              <text x={labelPos.x} y={labelPos.y + 13} textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="500" fill={dm ? cfg.textColorDark : cfg.textColor} fontFamily="var(--font-display), Georgia, serif">
                {cfg.label}
              </text>
              {sectorFoods.map((food, i) => {
                const rawPos = positions[i]
                if (!rawPos) return null
                const w = chipWidth(food.name)
                const pos = clampChipPos(rawPos, w)
                const isDragging = plateDragGhost?.foodId === food.id
                return (
                  <g
                    key={food.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${food.name} — press Enter for options, drag to remove`}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab', opacity: isDragging ? 0.3 : 1 }}
                    onPointerDown={e => {
                      e.preventDefault()
                      plateDragRef.current = { food, startX: e.clientX, startY: e.clientY, curX: e.clientX, curY: e.clientY, outside: false }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        const rect = plateRef.current?.getBoundingClientRect()
                        setPlatePopover({ food, x: (rect?.left ?? 0) + (rect?.width ?? 0) / 2, y: (rect?.top ?? 0) + (rect?.height ?? 0) / 2 })
                      }
                    }}
                  >
                    <rect x={pos.x - w / 2} y={pos.y - CHIP_HEIGHT / 2} width={w} height={CHIP_HEIGHT} rx={CHIP_HEIGHT / 2} fill={dm ? 'rgba(28, 25, 23, 0.85)' : 'rgba(255, 255, 255, 0.88)'} stroke={dm ? cfg.strokeDark : cfg.stroke} strokeOpacity="0.3" />
                    <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="10" fill={dm ? cfg.textColorDark : cfg.textColor} fontWeight="600" fontFamily="system-ui, sans-serif">
                      {chipDisplayName(food.name)}
                    </text>
                    <title>{food.name}</title>
                  </g>
                )
              })}
            </g>
          )
        })}

        <circle cx={PLATE_CX} cy={PLATE_CY} r={PLATE_R} fill="url(#sectorOverlay)" style={{ pointerEvents: 'none' }} />

        <circle cx={PLATE_CX} cy={PLATE_CY} r={PLATE_INNER_R} fill={dm ? '#364a2e' : '#e8efe4'} stroke={dm ? '#5f7a4f' : '#c3d1b8'} strokeWidth="1.5" />
        <circle cx={PLATE_CX} cy={PLATE_CY} r={7} fill={dm ? '#8fae7e' : '#a9c096'} opacity="0.7" />

        {plateDragGhost && (() => {
          const draggedFood = loveFoods.find(f => f.id === plateDragGhost.foodId)
          const ft = draggedFood?.foodType ?? 'other'
          const cfg2 = FOOD_TYPE_CONFIG[ft]
          const ghostName = draggedFood?.name ?? ''
          const gw = chipWidth(ghostName)
          const gx = plateDragGhost.svgX
          const gy = plateDragGhost.svgY
          return (
            <g style={{ pointerEvents: 'none' }} opacity="0.95" filter="url(#ghostShadow)" transform={`translate(${gx}, ${gy}) scale(1.15) translate(${-gx}, ${-gy})`}>
              <rect x={gx - gw / 2} y={gy - CHIP_HEIGHT / 2} width={gw} height={CHIP_HEIGHT} rx={CHIP_HEIGHT / 2} fill={dm ? 'rgba(28, 25, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)'} stroke={dm ? cfg2.strokeDark : cfg2.stroke} strokeOpacity="0.3" />
              <text x={gx} y={gy} textAnchor="middle" dominantBaseline="central" fontSize="10" fill={dm ? cfg2.textColorDark : cfg2.textColor} fontWeight="600" fontFamily="system-ui, sans-serif">
                {chipDisplayName(ghostName)}
              </text>
              {plateDragGhost.outside && (
                <text x={gx} y={gy + 26} textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="700">Release to remove</text>
              )}
            </g>
          )
        })()}
      </svg>

      <div className="relative mt-5 max-w-sm mx-auto">
        <input
          type="text"
          value={plateInput}
          placeholder="Add food to your plate…"
          aria-label="Add food to your plate"
          role="combobox"
          aria-expanded={showAutocomplete && filtered.length > 0}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="plate-autocomplete"
          className={`w-full px-4 py-2.5 text-sm border rounded-2xl focus:outline-none focus:ring-1 ${dm ? 'bg-stone-800 border-stone-600 text-stone-200 placeholder-stone-500 focus:border-green-500/50 focus:ring-green-500/30' : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-green-700/50 focus:ring-green-700/30'}`}
          onChange={e => {
            setPlateInput(e.target.value)
            setShowAutocomplete(e.target.value.length > 0)
          }}
          onFocus={() => { if (plateInput.length > 0) setShowAutocomplete(true) }}
          onBlur={() => { setTimeout(() => setShowAutocomplete(false), 200) }}
          onKeyDown={e => {
            if (e.key === 'Enter' && plateInput.trim()) {
              onAddFood(plateInput.trim(), 'love')
              setPlateInput('')
            } else if (e.key === 'Escape') {
              setShowAutocomplete(false)
            }
          }}
        />
        {showAutocomplete && filtered.length > 0 && (
          <ul id="plate-autocomplete" role="listbox" aria-label="Food suggestions" className={`absolute z-20 w-full border rounded-xl shadow-lg max-h-36 overflow-y-auto top-full mt-1 list-none p-0 m-0 ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
            {filtered.map(name => (
              <li key={name} role="option" aria-selected={false}>
                <button
                  className={`w-full text-left px-3 py-1.5 text-sm focus:outline-none ${dm ? 'text-stone-200 hover:bg-stone-700 focus:bg-stone-700' : 'text-stone-700 hover:bg-stone-50 focus:bg-stone-50'}`}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    onAddFood(name, 'love')
                    setPlateInput('')
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

      {platePopover && (
        <div className="fixed inset-0 z-30" onClick={() => setPlatePopover(null)}
          onKeyDown={e => { if (e.key === 'Escape') setPlatePopover(null) }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Options for ${platePopover.food.name}`}
            className={`absolute rounded-2xl shadow-xl border p-3 w-44 ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}
            style={{ left: Math.min(platePopover.x, window.innerWidth - 184), top: Math.min(platePopover.y - 8, window.innerHeight - 140) }}
            onClick={e => e.stopPropagation()}
          >
            <p className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${dm ? 'text-stone-200' : 'text-stone-800'}`}>
              <FoodTypeIcon
                name={FOOD_TYPE_CONFIG[platePopover.food.foodType].iconName}
                className="w-4 h-4 shrink-0"
                style={{ color: dm ? FOOD_TYPE_CONFIG[platePopover.food.foodType].strokeDark : FOOD_TYPE_CONFIG[platePopover.food.foodType].stroke }}
              />
              <span className="truncate">{platePopover.food.name}</span>
            </p>
            <button
              className={`w-full text-left px-3 py-1.5 rounded-xl text-sm mb-1 ${dm ? 'hover:bg-stone-700 text-green-300' : 'hover:bg-stone-50 text-green-800'}`}
              onClick={() => { onMoveFood(platePopover.food, 'exploring'); setPlatePopover(null) }}
            >
              🌱 Move to Exploring
            </button>
            <button
              className={`w-full text-left px-3 py-1.5 rounded-xl text-sm mb-1 ${dm ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              onClick={() => { onDeleteFood(platePopover.food.id); setPlatePopover(null) }}
            >
              🗑️ Remove
            </button>
            <button
              className={`w-full text-left px-3 py-1.5 rounded-xl text-sm ${dm ? 'hover:bg-stone-700 text-stone-400' : 'hover:bg-stone-50 text-stone-600'}`}
              onClick={() => { onSelectFood(platePopover.food); setPlatePopover(null) }}
            >
              Details →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
