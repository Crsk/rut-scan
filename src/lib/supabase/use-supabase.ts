import { getClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

export const useSupabase = () => useMemo(getClient(), [])
