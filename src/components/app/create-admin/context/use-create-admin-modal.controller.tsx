'use client'
import { useState } from 'react'
import { UseCreateAdminModal } from '@/components/app/create-admin/context/use-create-admin-modal.type'

export const useCreateAdminModalController = (): UseCreateAdminModal => {
  const [open, setOpen] = useState(false)

  return {
    open,
    setOpen
  }
}
