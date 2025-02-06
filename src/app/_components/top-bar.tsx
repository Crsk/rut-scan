'use client'
/* import { useCreateAdminModal } from '@/components/app/create-admin/context/create-admin-modal.context' */
import { CreateAdminDialog } from '@/components/app/create-admin/create-admin-dialog'
import { useLoginModal } from '@/components/app/login/context/login-modal.context'
import { LoginDialog } from '@/components/app/login/login-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export const TopBar = () => {
  const { authUser, logout } = useAuth()
  const { setOpen: setLoginModalOpen } = useLoginModal()
  /* const { setOpen: setCreateAdminModalOpen } = useCreateAdminModal() */
  const pathname = usePathname()
  const { rut } = useParams<{ rut: string }>()

  return (
    <>
      <LoginDialog />
      <CreateAdminDialog />
      <div className="fixed w-screen py-4 px-8 bg-white z-10" style={{ display: rut ? 'none' : 'block' }}>
        <div className="flex justify-between">
          <div className="flex items-center">
            {pathname !== '/' && (
              <Link href="/">
                <Button variant="ghost">
                  <HomeIcon /> Inicio
                </Button>
              </Link>
            )}
          </div>
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
            {/* TODO: Allow users to create admin users */}
            {/* <Button variant="secondary" onClick={() => setCreateAdminModalOpen(true)}>
              <Plus /> Nuevo Admin
            </Button> */}
          </div>
        </div>
      </div>
    </>
  )
}
