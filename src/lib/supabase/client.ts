'use client'
import { createBrowserClient } from '@supabase/ssr'

let supabaseClientInstance: any

export const getClient = () => {
  if (supabaseClientInstance) return supabaseClientInstance

  supabaseClientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  console.log('Initializing Supabase Client')

  return supabaseClientInstance
}
