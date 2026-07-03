import { FoodCategory, FoodType } from './types'

// Plate geometry
export const PLATE_CX = 200
export const PLATE_CY = 200
export const PLATE_R = 183
export const PLATE_INNER_R = 38
export const PLATE_RIM_WIDTH = 9
export const FOOD_RING_INNER_R = 48
export const FOOD_RING_OUTER_R = 158
export const FOOD_CIRCLE_PAD = 20

// Interaction thresholds
export const DRAG_CLICK_THRESHOLD = 8
export const SWIPE_ADD_THRESHOLD = 60
export const SWIPE_DETECT_THRESHOLD = 30

// App config
export const ATTEMPT_GOAL = 7
export const STORAGE_KEY = 'flavorfriend-foods'
export const DISMISSED_KEY = 'flavorfriend-dismissed'
export const ONBOARDED_KEY = 'flavorfriend-onboarded'
export const BARRIERS_KEY = 'flavorfriend-barriers'

export const FOOD_TYPES: FoodType[] = ['vegetable', 'grain', 'legume', 'other']
export const CATEGORIES: FoodCategory[] = ['love', 'exploring', 'curious', 'notYet']

export const FOOD_TYPE_CONFIG: Record<FoodType, {
  label: string; iconName: string
  fill: string; stroke: string; textColor: string
  fillDark: string; strokeDark: string; textColorDark: string
  startDeg: number; endDeg: number
}> = {
  vegetable: {
    label: 'Vegetables', iconName: 'Carrot',
    fill: '#c8dfb0', stroke: '#4f7c33', textColor: '#2f4d1b',
    fillDark: '#43592b', strokeDark: '#adcc85', textColorDark: '#d9e9c4',
    startDeg: 180, endDeg: 270,
  },
  grain: {
    label: 'Grains', iconName: 'Wheat',
    fill: '#f0dc9e', stroke: '#a2781f', textColor: '#63480f',
    fillDark: '#5f4b1d', strokeDark: '#dbae51', textColorDark: '#efddaa',
    startDeg: 270, endDeg: 360,
  },
  legume: {
    label: 'Legumes', iconName: 'PeaPod',
    fill: '#eecca5', stroke: '#ac5c28', textColor: '#6b3813',
    fillDark: '#603a20', strokeDark: '#d88e56', textColorDark: '#f1d4b5',
    startDeg: 0, endDeg: 90,
  },
  other: {
    label: 'Other', iconName: 'Acorn',
    fill: '#bcdccb', stroke: '#33755a', textColor: '#1f4936',
    fillDark: '#2f4a3c', strokeDark: '#83b79b', textColorDark: '#cfe3d7',
    startDeg: 90, endDeg: 180,
  },
}

// Shared progress-ring colors (SVG strokes can't use Tailwind classes)
export const PROGRESS_RING = {
  track: { light: '#e7e5e4', dark: '#44403c' },
  bar:   { light: '#15803d', dark: '#4ade80' },
}
