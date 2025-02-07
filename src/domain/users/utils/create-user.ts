import { UserProps } from '@/core/domain/user/user-props.interface'

export const createUser = (overrides?: Partial<UserProps>): UserProps => ({
  id: '',
  email: '',
  family: {},
  position: '',
  rut: '',
  name: '',
  roles: ['PARTNER'],
  imageUrl: null,
  ...overrides
})
