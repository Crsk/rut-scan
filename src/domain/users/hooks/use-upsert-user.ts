import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useDataService } from '@/contexts/service/data.context'

export const useUpsertUser = () => {
  const { userService } = useDataService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ json }: { json: Partial<UserProps> }) => {
      if (json.id) {
        const existingUser = await userService.getById({ id: json.id })
        const userExists: boolean = !!existingUser
        if (userExists) return await userService.update({ id: json.id, updated: json })
      }

      return await userService.add({ json })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })
}
