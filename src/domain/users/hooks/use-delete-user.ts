import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/contexts/service/data.context'

export const useDeleteUser = () => {
  const { userService } = useDataService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => await userService.delete({ id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })
}
