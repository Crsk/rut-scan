import { UserService } from '@/features/users/api/user.service'
import { UserRepository } from '@/features/users/api/user.repository'
import { SupabaseClient } from '@supabase/supabase-js'

export class ServiceLocator {
  private static instance: ServiceLocator
  private services: Map<symbol, any> = new Map()

  private constructor() {}

  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) ServiceLocator.instance = new ServiceLocator()

    return ServiceLocator.instance
  }

  register<T>(key: symbol, service: T): void {
    this.services.set(key, service)
  }

  exists<T>(key: symbol): boolean {
    return !!this.services.get(key)
  }

  get<T>(key: symbol): T {
    const service = this.services.get(key)
    if (!service) throw new Error(`Service not found for key: ${key.toString()}`)

    return service
  }
}

export const SERVICE_TOKENS = {
  USER_SERVICE: Symbol('USER_SERVICE')
}

export const createServices = (client: SupabaseClient) => {
  const locator = ServiceLocator.getInstance()

  if (!locator.exists(SERVICE_TOKENS.USER_SERVICE)) {
    const userRepository = new UserRepository(client)
    const userService = new UserService(userRepository)
    locator.register(SERVICE_TOKENS.USER_SERVICE, userService)
  }
}
