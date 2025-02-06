import { Base } from '@/core/domain/base.interface'

export interface UserProps extends Base {
  email: string
  name?: string
  rut?: string
  family?: any // TODO jsonb
  position?: string
  roles?: ('ADMIN' | 'SUPER_ADMIN' | 'USER' | 'PARTNER')[]
}
