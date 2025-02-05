'use client'
import { useCallback, useState } from 'react'
import { toast } from '@/lib/toast/toast'
import { useAuth } from '@/contexts/auth/auth.context'
import { UseLoginModal } from '@/components/app/login/context/use-login-modal.type'

export const useLoginModalController = (): UseLoginModal => {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [step, setStep] = useState<'EMAIL' | 'VERIFICATION' | 'ERROR'>('EMAIL')
  const { signInWithEmail, verifyCode } = useAuth()
  const [open, setOpen] = useState(false)

  const sendCode = useCallback(async () => {
    try {
      // optimistic update
      setStep('VERIFICATION')
      setErrorMessage(null)

      const { error } = await signInWithEmail({ email })
      if (error) throw new Error(error.message)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        setErrorMessage(error.message)
        setStep('ERROR') // go back if optimistic failed
      }
    }
  }, [email, signInWithEmail])

  const closeAndReset = () => {
    setErrorMessage(null)
    toast({ message: 'Hey there!', icon: '👋' })
    setOpen(false)
    setStep('EMAIL')
  }

  const verify = useCallback(
    async (code: string) => {
      try {
        if (code.length === 6) {
          const { error, session } = await verifyCode({ email, token: code })
          if (error) throw new Error(error.message)
          else {
            closeAndReset()

            return {
              success: true,
              email,
              id: session?.user.id || ''
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
          setErrorMessage(error.message)
        }
      }

      return { success: false, email, id: null }
    },
    [email, verifyCode]
  )

  return {
    setEmail,
    email,
    errorMessage,
    setErrorMessage,
    step,
    setStep,
    verify,
    sendCode,
    open,
    setOpen
  }
}
