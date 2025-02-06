import { UserProps } from '@/core/domain/user/user-props.interface'
import { UserRepository } from '@/core/adapters/user-repository.interface'
import { SnakeCase } from '@/utils/case'

export class UserInMemoryRepository implements UserRepository {
  private users: Map<string, SnakeCase<UserProps>> = new Map()

  async get({ email }: { email: string }): Promise<SnakeCase<UserProps> | undefined> {
    const user = Array.from(this.users.values()).find(u => u.email === email)

    return user
  }

  async getByRut({ rut }: { rut: string }): Promise<SnakeCase<UserProps> | null> {
    const user = Array.from(this.users.values()).find(u => u.rut === rut)

    return user || null
  }

  async getById({ id }: { id: string }): Promise<SnakeCase<UserProps> | null> {
    return this.users.get(id) || null
  }

  async getAll(): Promise<SnakeCase<UserProps>[]> {
    return Array.from(this.users.values())
  }

  async add({ json }: { json: SnakeCase<UserProps> }): Promise<void> {
    this.users.set(json.id, json)
  }

  async update({ id, updated }: { id: string; updated: Partial<SnakeCase<UserProps>> }): Promise<void> {
    const existing = this.users.get(id)
    if (existing) this.users.set(id, { ...existing, ...updated })
  }

  async delete({ id }: { id: string }): Promise<void> {
    this.users.delete(id)
  }

  clear = () => void this.users.clear()
}
