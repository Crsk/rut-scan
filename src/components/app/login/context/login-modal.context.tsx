'use client'
import { createContext } from '@/contexts/create-context'
import { useLoginModalController } from '@/components/app/login/context/use-login-modal.controller'
import { UseLoginModal } from '@/components/app/login/context/use-login-modal.type'

export const { Provider: LoginModalProvider, useValue: useLoginModal } =
  createContext<UseLoginModal>(useLoginModalController)
