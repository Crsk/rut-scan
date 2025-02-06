'use client'
import { useEffect } from 'react'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useUsers } from '@/features/users/hooks/use-users'
import { NewPartner } from '@/app/socios/_components/partners/new-parter'
import { ManagePartners } from '@/app/socios/_components/partners/manage-partners'
import { ManagePartnersProvider, useManagePartners } from '@/app/socios/_components/partners/partners.context'

const Partners = () => {
  const { data: users } = useUsers()
  const { setPartners } = useManagePartners()

  useEffect(() => {
    if (!users) return

    const _partners: UserProps[] = users.filter(user => !user.isAdmin && !user.isSuperAdmin)
    setPartners(_partners)
  }, [users])

  return (
    <div className="flex flex-col px-0 md:px-32 lg:px-64 pt-12">
      <h1 className="pb-4">Socios</h1>
      <ManagePartners />
      <div className="pt-16 pb-64">
        <h2>Nuevo Socio</h2>
        <NewPartner />
      </div>
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
