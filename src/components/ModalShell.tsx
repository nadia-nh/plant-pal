'use client'

import { useEffect, useRef } from 'react'
import { surface } from '@/lib/theme'

interface ModalShellProps {
  open: boolean
  titleId: string
  darkMode?: boolean
  maxWidth?: 'sm' | 'md'
  padding?: 'sm' | 'lg'
  scrollable?: 'none' | '80vh' | '90vh'
  zIndex?: 40 | 50
  onBackdropClick?: () => void
  onEscape?: () => void
  children: React.ReactNode
}

const MAX_WIDTH_CLASS = { sm: 'max-w-sm', md: 'max-w-md' }
const PADDING_CLASS = { sm: 'p-4', lg: 'p-6' }
const SCROLL_CLASS = { none: '', '80vh': 'max-h-[80vh] overflow-y-auto', '90vh': 'max-h-[90vh] overflow-y-auto' }
const Z_INDEX_CLASS = { 40: 'z-40', 50: 'z-50' }

export function ModalShell({
  open, titleId, darkMode = false, maxWidth = 'sm', padding = 'lg', scrollable = 'none', zIndex = 50,
  onBackdropClick, onEscape, children,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 ${Z_INDEX_CLASS[zIndex]}`}
      onClick={onBackdropClick}
      onKeyDown={e => { if (e.key === 'Escape') onEscape?.() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`rounded-2xl ${PADDING_CLASS[padding]} ${MAX_WIDTH_CLASS[maxWidth]} w-full ${SCROLL_CLASS[scrollable]} focus:outline-none ${surface(darkMode)}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
