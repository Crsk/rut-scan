import { useDataService } from '@/contexts/service/data.context'
import { useQuery } from '@tanstack/react-query'

export const useUser = ({ email }: { email: string }) => {
  const { userService } = useDataService()
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['user', email],
    queryFn: async () => await userService.get({ email }),
    enabled: !!email
  })

  return { isPending, error, data, isFetching }
}
