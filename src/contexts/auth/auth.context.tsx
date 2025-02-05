'use client'
import { createContext } from '@/contexts/create-context'
import { UseAuth } from '@/contexts/auth/use-auth.type'
import { useSupabaseAuthController } from '@/contexts/auth/supabase-auth.controller'

export const { Provider: AuthProvider, useValue: useAuth } = createContext<UseAuth>(useSupabaseAuthController)
