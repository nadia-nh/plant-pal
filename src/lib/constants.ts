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
  label: string; iconName: string; fill: string; stroke: string; textColor: string; startDeg: number; endDeg: number
}> = {
  vegetable: { label: 'Vegetables', iconName: 'Leaf',  fill: '#dce7d5', stroke: '#5f7a4f', textColor: '#364a2e', startDeg: 180, endDeg: 270 },
  grain:     { label: 'Grains',     iconName: 'Wheat', fill: '#f3e5c8', stroke: '#a3803c', textColor: '#6b5320', startDeg: 270, endDeg: 360 },
  legume:    { label: 'Legumes',    iconName: 'Bean',  fill: '#f0d9c8', stroke: '#ad6b46', textColor: '#6e4028', startDeg: 0,   endDeg: 90  },
  other:     { label: 'Other',      iconName: 'Nut',   fill: '#d5e3dd', stroke: '#4e7d6c', textColor: '#2f4d42', startDeg: 90,  endDeg: 180 },
}

// Shared progress-ring colors (SVG strokes can't use Tailwind classes)
export const PROGRESS_RING = {
  track: { light: '#e7e5e4', dark: '#44403c' },
  bar:   { light: '#15803d', dark: '#4ade80' },
}
