import { useAuth } from '@/contexts/auth/auth.context'
import { useUserById } from '@/domain/users/hooks/use-user-by-id'
import { useEffect, useState } from 'react'

export const useCanManage = () => {
  const { authUser } = useAuth()
  const { data: user } = useUserById({ id: authUser?.id ?? '' })
  const [canManage, setCanManage] = useState<boolean>(false)

  useEffect(() => {
    if (user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN')) {
      setCanManage(true)
    }
  }, [user])

  return { canManage }
}
