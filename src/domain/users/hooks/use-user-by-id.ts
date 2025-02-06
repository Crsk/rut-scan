import { useDataService } from '@/contexts/service/data.context'
import { useQuery } from '@tanstack/react-query'

export const useUserById = ({ id }: { id: string }) => {
  const { userService } = useDataService()
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => await userService.getById({ id }),
    enabled: !!id
  })

  return { isPending, error, data, isFetching }
}
