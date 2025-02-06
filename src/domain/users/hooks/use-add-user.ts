import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useDataService } from '@/contexts/service/data.context'

export const useAddUser = () => {
  const { userService } = useDataService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ json }: { json: Partial<UserProps> }) => await userService.add({ json }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })
}
