import { useDataService } from '@/contexts/service/data.context'
import { useQuery } from '@tanstack/react-query'

export const useUsers = () => {
  const { userService } = useDataService()
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: async () => await userService.getAll()
  })

  return { isPending, error, data, isFetching }
}
