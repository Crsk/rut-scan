import { SnakeCase } from '@/utils/case'
import { Async } from '@/core/utils/async-adapter'
import { UserProps } from '@/core/domain/user/user-props.interface'

export interface _UserRepository {
  get({ email }: { email: string }): SnakeCase<UserProps> | undefined
  getAll(): SnakeCase<UserProps>[]
  add({ json }: { json: SnakeCase<UserProps> }): void
  update({ id, updated }: { id: string; updated: Partial<SnakeCase<UserProps>> }): void
  delete({ id }: { id: string }): void
}

export interface _UserService {
  get({ email }: { email: string }): UserProps | undefined
  getAll(): UserProps[]
  add({ json }: { json: UserProps }): void
  update({ id, updated }: { id: string; updated: Partial<UserProps> }): void
  delete({ id }: { id: string }): void
}

export interface UserRepository extends Async<_UserRepository> {}
export interface UserService extends Async<_UserService> {}
