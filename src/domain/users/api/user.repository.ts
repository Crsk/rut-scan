import { UserProps } from '@/core/domain/user/user-props.interface'
import { UserRepository as IUserRepository } from '@/core/adapters/user-repository.interface'
import { SnakeCase } from '@/utils/case'
import { SupabaseClient } from '@supabase/supabase-js'

export class UserRepository implements IUserRepository {
  constructor(private client: SupabaseClient) {}

  async get({ email }: { email: string }) {
    return (await this.client.from('users').select('*').eq('email', email).single()).data as UserProps
  }

  async getByRut({ rut }: { rut: string }) {
    const user = (await this.client.from('users').select('*').eq('rut', rut).single()).data as UserProps

    return user || null
  }

  async getById({ id }: { id: string }) {
    const user = (await this.client.from('users').select('*').eq('id', id).single()).data as UserProps

    return user || null
  }

  async getAll(): Promise<UserProps[]> {
    return (await this.client.from('users').select('*')).data as UserProps[]
  }

  async add({ json }: { json: SnakeCase<UserProps> }) {
    const { error } = await this.client.from('users').upsert(json).select()
    if (error) {
      console.error('Error creating user', { error })

      return
    }
  }

  async update({ id, updated }: { id: string; updated: Partial<SnakeCase<UserProps>> }) {
    await this.client.from('users').update(updated).eq('id', id).select()
  }

  async delete({ id }: { id: string }) {
    await this.client.from('users').delete({ count: 'exact' }).eq('id', id)
  }
}
