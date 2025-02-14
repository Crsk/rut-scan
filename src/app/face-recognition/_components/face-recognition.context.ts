'use client'
import { createContext } from '@/contexts/create-context'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useCallback, useState } from 'react'

export type MatchResult<T = UserProps> = {
  label: string
  distance: number
  metadata: { entity: T }
}

export type UseFaceRecognition = {
  matchResult: MatchResult | null
  setMatchResult: (result: MatchResult | null) => void
  lastMatch: MatchResult | null
  setLastMatch: (result: MatchResult | null) => void
  reset: () => void
}

const useFaceRecognitionController = () => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null)
  const reset = useCallback(() => {
    setMatchResult(null)
    setLastMatch(null)
  }, [setMatchResult, setLastMatch])

  return {
    matchResult,
    setMatchResult,
    reset,
    lastMatch,
    setLastMatch
  }
}

export const { Provider: FaceRecognitionProvider, useValue: useFaceRecognition } =
  createContext<UseFaceRecognition>(useFaceRecognitionController)
