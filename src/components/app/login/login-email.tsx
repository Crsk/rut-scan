'use client'
import { Input } from '@/components/ui/input'
import { useLoginModal } from './context/login-modal.context'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useCallback } from 'react'
import { useDataService } from '@/contexts/service/data.context'

export const LoginEmail = () => {
  const { email, setEmail, sendCode, setErrorMessage } = useLoginModal()
  const { userService } = useDataService()

  const handleSubmit = useCallback(async () => {
    const user = await userService.get({ email })

    setEmail(email)
    sendCode()
    /* if (user?.isAdmin) {
    } else {
      setErrorMessage('Email no autorizado')
    } */
  }, [email])

  return (
    <div className="flex flex-nowrap gap-4 items-end w-full">
      <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <Button onClick={handleSubmit}>
        <Send /> Recibir código
      </Button>
    </div>
  )
}
