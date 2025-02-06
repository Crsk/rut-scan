'use client'
import { Input } from '@/components/ui/input'
import { useLoginModal } from './context/login-modal.context'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useCallback } from 'react'

export const LoginEmail = () => {
  const { email, setEmail, sendCode } = useLoginModal()

  const handleSubmit = useCallback(async () => {
    setEmail(email)
    sendCode()
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
