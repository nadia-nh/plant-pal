'use client'

import { useState, useEffect, useRef } from 'react'
import { DISMISSED_KEY } from '@/lib/constants'
import * as db from '@/lib/supabase/db'

export function useDismissedSuggestions(userId: string | null | undefined, onSyncError?: () => void) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const initializedRef = useRef(false)
  const onSyncErrorRef = useRef(onSyncError)
  onSyncErrorRef.current = onSyncError

  useEffect(() => {
    if (userId === undefined) return

    initializedRef.current = false

    if (userId === null) {
      try {
        const stored = localStorage.getItem(DISMISSED_KEY)
        if (stored) setDismissed(JSON.parse(stored))
        else setDismissed([])
      } catch {
        setDismissed([])
      }
      initializedRef.current = true
      return
    }

    db.fetchDismissed(userId).then(cloud => {
      setDismissed(cloud)
      localStorage.removeItem(DISMISSED_KEY)
      initializedRef.current = true
    }).catch(() => {
      try {
        const stored = localStorage.getItem(DISMISSED_KEY)
        setDismissed(stored ? JSON.parse(stored) : [])
      } catch {
        setDismissed([])
      }
      initializedRef.current = true
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    if (!initializedRef.current) return

    if (userId === null) {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed))
    } else if (userId !== undefined) {
      db.saveDismissed(userId, dismissed).catch(() => { console.error('sync failed'); onSyncErrorRef.current?.() })
    }
  }, [dismissed, userId])

  return [dismissed, setDismissed] as const
}
