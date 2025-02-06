import { useDataService } from '@/contexts/service/data.context'
import { useQuery } from '@tanstack/react-query'

export const useUserByRut = ({ rut }: { rut: string }) => {
  const { userService } = useDataService()
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['user', rut],
    queryFn: async () => await userService.getByRut({ rut }),
    enabled: !!rut
  })

  return { isPending, error, data, isFetching }
}
