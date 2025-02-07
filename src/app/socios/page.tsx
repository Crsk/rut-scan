'use client'
import { useEffect } from 'react'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useUsers } from '@/domain/users/hooks/use-users'
import { NewPartner } from '@/app/socios/_components/partners/new-parter'
import { ManagePartners } from '@/app/socios/_components/partners/manage-partners'
import { ManagePartnersProvider, useManagePartners } from '@/app/socios/_components/partners/partners.context'
import { useCanManage } from '@/hooks/use-can-manage'

const Partners = () => {
  const { data: users } = useUsers()
  const { setPartners } = useManagePartners()
  const { canManage } = useCanManage()

  useEffect(() => {
    if (!users) return

    const _partners: UserProps[] = users.filter(user => user.roles?.includes('PARTNER'))
    setPartners(_partners)
  }, [users, setPartners])

  return (
    <div className="flex flex-col px-6 md:px-32 lg:px-64 pt-24">
      <h1 className="pb-4">Socios</h1>
      <ManagePartners canManage={canManage} />
      <div className="w-full bg-zinc-200 h-[1px] mt-32"></div>
      {canManage && (
        <div className="pb-64 pt-3">
          <h2 className="flex justify-end pb-8 text-zinc-400">Crear Socio</h2>
          <NewPartner />
        </div>
      )}
    </div>
  )
}

const Page = () => {
  return (
    <ManagePartnersProvider>
      <Partners />
    </ManagePartnersProvider>
  )
}

export default Page
