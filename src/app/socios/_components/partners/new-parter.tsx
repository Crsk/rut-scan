'use client'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useManagePartners } from '@/app/socios/_components/partners/partners.context'
import { UploadImage } from '@/app/socios/_components/partners/upload-image'
import { toast } from '@/lib/toast/toast'

export const NewPartner = () => {
  const {
    name,
    setName,
    rut,
    setRut,
    addPartner,
    uploadImage: { handleUpload, isUploading }
  } = useManagePartners()

  const handleCreate = async () => {
    const imageUrl = await handleUpload()
    addPartner({ imageUrl })
    toast({ message: 'Socio creado', icon: '✅' })
  }

  return (
    <div>
      <UploadImage />
      <div className="flex gap-4 pt-4 flex-col md:flex-row">
        <Input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="RUT" value={rut} onChange={e => setRut(e.target.value)} />

        <Button disabled={isUploading} onClick={handleCreate}>
          <Plus /> Agregar
        </Button>
      </div>
    </div>
  )
}
