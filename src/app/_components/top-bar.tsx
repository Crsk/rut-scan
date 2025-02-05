'use client'
import { useCreateAdminModal } from '@/components/app/create-admin/context/create-admin-modal.context'
import { CreateAdminDialog } from '@/components/app/create-admin/create-admin-dialog'
import { useLoginModal } from '@/components/app/login/context/login-modal.context'
import { LoginDialog } from '@/components/app/login/login-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'
import { Plus } from 'lucide-react'

export const TopBar = () => {
  const { authUser, logout } = useAuth()
  const { setOpen: setLoginModalOpen } = useLoginModal()
  const { setOpen: setCreateAdminModalOpen } = useCreateAdminModal()

  return (
    <>
      <LoginDialog />
      <CreateAdminDialog />
      <div className="w-screen flex justify-end pt-6 pr-8">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            {authUser?.email && (
              <>
                <span>👋</span>
                <span>{authUser?.email}</span>
              </>
            )}
          </div>
          {authUser?.email ? (
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setLoginModalOpen(true)}>
              Login
            </Button>
          )}
          <Button variant="secondary" onClick={() => setCreateAdminModalOpen(true)}>
            <Plus /> Nuevo Admin
          </Button>
        </div>
      </div>
    </>
  )
}
