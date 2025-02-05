'use client'
import { createContext } from '@/contexts/create-context'
import { useDataServiceController } from '@/contexts/service/controllers/use-data-service.controller'
import { UseDataService } from '@/contexts/service/types/use-data-service.type'

export const { Provider: DataServiceProvider, useValue: useDataService } =
  createContext<UseDataService>(useDataServiceController)
