'use client'
import { Dispatch, useCallback, useState } from 'react'
import { createContext } from '@/contexts/create-context'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useAddUser } from '@/domain/users/hooks/use-add-user'
import { useDeleteUser } from '@/domain/users/hooks/use-delete-user'

export type UseManagePartners = {
  name: string
  setName: Dispatch<React.SetStateAction<string>>
  rut: string
  setRut: Dispatch<React.SetStateAction<string>>
  addPartner: () => void
  setPartners: Dispatch<React.SetStateAction<UserProps[]>>
  partners: UserProps[]
  deleteUser: ({ id }: { id: string }) => void
}

const useManagePartnersController = () => {
  const [name, setName] = useState('')
  const [rut, setRut] = useState('')
  const [partners, setPartners] = useState<UserProps[]>([])
  const { mutate: deleteUser } = useDeleteUser()
  const { mutate: addUser } = useAddUser()

  const addPartner = useCallback(() => {
    const partner: Partial<UserProps> = {
      name,
      rut,
      roles: ['PARTNER']
    }

    addUser({ json: partner })

    setName('')
    setRut('')
  }, [name, rut, addUser])

  return { name, setName, rut, setRut, addPartner, setPartners, partners, deleteUser }
}

export const { Provider: ManagePartnersProvider, useValue: useManagePartners } =
  createContext<UseManagePartners>(useManagePartnersController)
