// Shared dm-conditional (dark-mode) style tokens.
// The app doesn't use Tailwind's `dark:` variant — every component takes a
// `darkMode` prop and builds classNames with `dm ? '...' : '...'` ternaries.
// These helpers centralize the pairs that repeat verbatim across files.

export function surface(dm: boolean): string {
  return dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
}

export function textPrimary(dm: boolean): string {
  return dm ? 'text-stone-200' : 'text-stone-800'
}

export function textSecondary(dm: boolean): string {
  return dm ? 'text-stone-400' : 'text-stone-500'
}

export function inputField(dm: boolean): string {
  return dm
    ? 'bg-stone-800 border-stone-600 text-stone-200 placeholder-stone-500 focus:border-green-500/50 focus:ring-green-500/30'
    : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-green-700/50 focus:ring-green-700/30'
}

export function dropdownItem(dm: boolean): string {
  return dm
    ? 'text-stone-200 hover:bg-stone-700 focus:bg-stone-700'
    : 'text-stone-700 hover:bg-stone-50 focus:bg-stone-50'
}
