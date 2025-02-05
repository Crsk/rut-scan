'use client'
import { createContext } from '@/contexts/create-context'
import { useCreateAdminModalController } from '@/components/app/create-admin/context/use-create-admin-modal.controller'
import { UseCreateAdminModal } from '@/components/app/create-admin/context/use-create-admin-modal.type'

export const { Provider: CreateAdminModalProvider, useValue: useCreateAdminModal } =
  createContext<UseCreateAdminModal>(useCreateAdminModalController)
