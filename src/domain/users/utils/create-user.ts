import { UserProps } from '@/core/domain/user/user-props.interface'

export const createUser = (props?: Partial<UserProps>): UserProps => ({
  id: props?.id || '',
  email: props?.email || '',
  family: props?.family || {},
  position: props?.position || '',
  rut: props?.rut || '',
  name: props?.name || '',
  roles: props?.roles || ['PARTNER'],
  imageUrl: props?.imageUrl || null
})
