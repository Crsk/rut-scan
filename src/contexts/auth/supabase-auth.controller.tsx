import { getClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { UseAuth } from './use-auth.type'

export const useSupabaseAuthController = (): UseAuth => {
  const [user, setUser] = useState<any | { id: string; email: string }>(null) // TODO rename to authUser
  const supabaseClient = getClient()

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    setUser,
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
      setUser(null)
    }
  }
}
