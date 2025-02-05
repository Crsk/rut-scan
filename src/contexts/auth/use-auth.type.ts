import { Session } from '@supabase/supabase-js'

export type UseAuth = {
  authUser: null | { id: string; email: string }
  setAuthUser: (user: null | { id: string; email: string }) => void
  signInWithEmail: ({ email }: { email: string }) => Promise<{ error: Error | null }>
  verifyCode: ({
    email,
    token
  }: {
    email: string
    token: string
  }) => Promise<{ session: Session | null; error: Error | null }>
  logout: () => Promise<void>
}
