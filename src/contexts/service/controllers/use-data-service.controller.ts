import { UseDataService } from '@/contexts/service/types/use-data-service.type'
import { createServices, SERVICE_TOKENS, ServiceLocator } from '@/contexts/service/service-factory'
import { UserService as IUserService } from '@/core/adapters/user-repository.interface'
import { getClient } from '@/lib/supabase/client'

export const useDataServiceController = (): UseDataService => {
  const client = getClient()
  createServices(client)
  const locator = ServiceLocator.getInstance()

  return {
    userService: locator.get<IUserService>(SERVICE_TOKENS.USER_SERVICE)
  }
}
