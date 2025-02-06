import { getClient } from '@/lib/supabase/client'

export const useSupabase = () => getClient()
