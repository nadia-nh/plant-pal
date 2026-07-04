import { useRef, useEffect } from 'react'

// Keeps a ref in sync with the latest value without writing to `.current`
// during render (which React flags via react-hooks/refs) — the write
// happens in an effect instead.
export function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}
