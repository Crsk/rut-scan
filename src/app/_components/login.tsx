'use client'
import { useLoginModal } from '@/components/app/login/context/login-modal.context'
import { LoginDialog } from '@/components/app/login/login-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'

export const Login = () => {
  const { user, logout } = useAuth()
  const { setOpen } = useLoginModal()

  return (
    <>
      <LoginDialog />
      <div className="w-screen flex justify-end pt-6 pr-8">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            {user?.email && (
              <>
                <span>👋</span>
                <span>{user?.email}</span>
              </>
            )}
          </div>
          {user?.email ? (
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
