'use client'

import { useState, useEffect } from 'react'
import { ONBOARDED_KEY } from '@/lib/constants'

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null)

  useEffect(() => {
    setHasSeenOnboarding(localStorage.getItem(ONBOARDED_KEY) === 'true')
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDED_KEY, 'true')
    setHasSeenOnboarding(true)
  }

  return { hasSeenOnboarding, completeOnboarding }
}
