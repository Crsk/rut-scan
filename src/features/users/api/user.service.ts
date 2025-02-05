import { generateId } from '@/utils/generate-id'
import { createUser } from '@/features/users/utils/create-user'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { UserRepository, UserService as IUserService } from '@/core/adapters/user-repository.interface'
import { objectToCamel, objectToSnake } from 'ts-case-convert'

export class UserService implements IUserService {
  constructor(private repository: UserRepository) {}

  async get({ email }: { email: string }): Promise<UserProps | undefined> {
    const snakeUser = await this.repository.get({ email })
    if (!snakeUser) return undefined

    return objectToCamel(snakeUser)
  }

  async getAll(): Promise<UserProps[]> {
    return objectToCamel(await this.repository.getAll())
  }

  async add({ json }: { json: Partial<UserProps> }) {
    const id = generateId()
    const user = createUser({ id, ...json })
    const snakeUser = objectToSnake(user)

    await this.repository.add({ json: snakeUser })
  }

  async update({ id, updated }: { id: string; updated: Partial<UserProps> }) {
    await this.repository.update({ id, updated: objectToSnake(updated) })
  }

  async delete({ id }: { id: string }) {
    await this.repository.delete({ id })
  }
}
