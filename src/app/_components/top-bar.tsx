'use client'
import { useLoginModal } from '@/components/app/login/context/login-modal.context'
import { LoginDialog } from '@/components/app/login/login-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'

export const TopBar = () => {
  const { authUser, logout } = useAuth()
  const { setOpen } = useLoginModal()

  return (
    <>
      <LoginDialog />
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
            <Button variant="outline" onClick={() => setOpen(true)}>
              Login
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
