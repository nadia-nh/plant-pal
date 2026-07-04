'use client'

import { useState, useEffect, useRef } from 'react'
import { DISMISSED_KEY } from '@/lib/constants'
import * as db from '@/lib/supabase/db'
import { useLatestRef } from './useLatestRef'

function loadLocalDismissed(): string[] {
  try {
    const stored = localStorage.getItem(DISMISSED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useDismissedSuggestions(userId: string | null | undefined, onSyncError?: () => void) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const initializedRef = useRef(false)
  const onSyncErrorRef = useLatestRef(onSyncError)

  useEffect(() => {
    if (userId === undefined) return

    initializedRef.current = false

    if (userId === null) {
      setDismissed(loadLocalDismissed())
      initializedRef.current = true
      return
    }

    db.fetchDismissed(userId).then(cloud => {
      setDismissed(cloud)
      localStorage.removeItem(DISMISSED_KEY)
      initializedRef.current = true
    }).catch(() => {
      setDismissed(loadLocalDismissed())
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
  }, [dismissed, userId, onSyncErrorRef])

  return [dismissed, setDismissed] as const
}
