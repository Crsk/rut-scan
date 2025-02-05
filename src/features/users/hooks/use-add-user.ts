import { useMutation } from '@tanstack/react-query'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useDataService } from '@/contexts/service/data.context'
import { createUser } from '@/features/users/utils/create-user'

export const useAddUser = () => {
  const { userService } = useDataService()

  return useMutation({
    mutationFn: ({ json }: { json: Partial<UserProps> }) => {
      return userService.add({ json: createUser(json) })
    }
  })
}
