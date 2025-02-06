import { getClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { UseAuth } from './use-auth.type'

export const useSupabaseAuthController = (): UseAuth => {
  const [authUser, setAuthUser] = useState<any | { id: string; email: string }>(null)
  const supabaseClient = getClient()

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_: any, session: any) => {
      if (session?.user) {
        setAuthUser(session.user)
      } else {
        setAuthUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabaseClient.auth])

  return {
    authUser,
    setAuthUser,
    signInWithEmail: async ({ email }) => {
      const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })

      return { error: error ? new Error(error.message) : null }
    },
    verifyCode: async ({ email, token }) => {
      const { data, error } = await supabaseClient.auth.verifyOtp({ email, token, type: 'email' })

      return { session: data.session, error: error ? new Error(error.message) : null }
    },
    logout: async () => {
      await supabaseClient.auth.signOut()
      setAuthUser(null)
    }
  }
}
