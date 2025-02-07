'use client'
import { Dispatch, useCallback, useRef, useState } from 'react'
import { createContext } from '@/contexts/create-context'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useAddUser } from '@/domain/users/hooks/use-add-user'
import { useDeleteUser } from '@/domain/users/hooks/use-delete-user'
import { getClient } from '@/lib/supabase/client'

export type UseManagePartners = {
  name: string
  setName: Dispatch<React.SetStateAction<string>>
  rut: string
  setRut: Dispatch<React.SetStateAction<string>>
  addPartner: ({ imageUrl }: { imageUrl: string }) => void
  setPartners: Dispatch<React.SetStateAction<UserProps[]>>
  partners: UserProps[]
  deleteUser: ({ id }: { id: string }) => void
  uploadImage: {
    inputRef: any
    handleUpload: () => Promise<string>
    handleImageChange: (event: any) => void
    isUploading: boolean
    preview: string | null
  }
}

const useManagePartnersController = () => {
  const [name, setName] = useState('')
  const [rut, setRut] = useState('')
  const [partners, setPartners] = useState<UserProps[]>([])
  const { mutate: deleteUser } = useDeleteUser()
  const { mutate: addUser } = useAddUser()
  const [file, setFile] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const addPartner = useCallback(
    ({ imageUrl }: { imageUrl: string }) => {
      const partner: Partial<UserProps> = {
        name,
        rut,
        roles: ['PARTNER'],
        imageUrl: imageUrl || null
      }

      addUser({ json: partner })

      setName('')
      setRut('')
      setPreview(null)
    },
    [name, rut, addUser]
  )

  const handleImageChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setFile(file)
      const reader: any = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = useCallback(async () => {
    if (!file) return null

    const supabase = getClient()
    setIsUploading(true)
    const filePath = `uploads/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('nextsupabase').upload(filePath, file)
    if (error) console.error('Upload error:', error.message)

    setIsUploading(false)
    const { data: publicUrlData } = await supabase.storage.from('nextsupabase').getPublicUrl(filePath)

    return publicUrlData.publicUrl
  }, [file, setIsUploading])

  return {
    name,
    setName,
    rut,
    setRut,
    addPartner,
    setPartners,
    partners,
    deleteUser,
    uploadImage: {
      inputRef,
      handleUpload,
      handleImageChange,
      isUploading,
      preview
    }
  }
}

export const { Provider: ManagePartnersProvider, useValue: useManagePartners } =
  createContext<UseManagePartners>(useManagePartnersController)
