import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useManagePartners } from '@/app/socios/_components/partners/partners.context'
import { Plus } from 'lucide-react'

export const NewPartner = () => {
  const { name, setName, rut, setRut, addPartner } = useManagePartners()

  return (
    <div className="flex gap-4 pt-4">
      <Input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="RUT" value={rut} onChange={e => setRut(e.target.value)} />

      <Button onClick={addPartner}>
        <Plus /> Agregar
      </Button>
    </div>
  )
}
