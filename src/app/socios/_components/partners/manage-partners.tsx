import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
/* import { Switch } from '@/components/ui/switch' */
import { useManagePartners } from '@/app/socios/_components/partners/partners.context'

export const ManagePartners = ({ canManage }: { canManage: boolean }) => {
  const { partners, deleteUser } = useManagePartners()

  return (
    <Table>
      {/* <TableCaption>Última Actualización: 5 Febrero 2025</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="w-[200px]">RUT</TableHead>
          {/* {canManage && <TableHead className="text-right w-[100px]">Activo</TableHead>} */}
          {canManage && <TableHead className="text-right w-[100px]">Borrar</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {partners.map(partner => {
          return (
            <TableRow key={partner.id}>
              <TableCell>{partner.name}</TableCell>
              <TableCell>{partner.rut}</TableCell>
              {/* {canManage && (
                <TableCell className="text-right">
                  <Switch />
                </TableCell>
              )} */}
              {canManage && (
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-500 hover:text-red-50"
                    onClick={() => deleteUser({ id: partner.id })}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
