'use client'
import { createContext } from '@/contexts/create-context'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useState } from 'react'

export type MatchResult<T = UserProps> = {
  label: string
  distance: number
  metadata: { entity: T }
}

export type UseFaceRecognition = {
  matchResult: MatchResult | null
  setMatchResult: (result: MatchResult | null) => void
  reset: () => void
}

const useFaceRecognitionController = () => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const reset = () => void setMatchResult(null)

  return {
    matchResult,
    setMatchResult,
    reset
  }
}

export const { Provider: FaceRecognitionProvider, useValue: useFaceRecognition } =
  createContext<UseFaceRecognition>(useFaceRecognitionController)
