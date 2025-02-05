'use client'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'
import { useDataService } from '@/contexts/service/data.context'
import { useLoginModal } from '@/components/app/login/context/login-modal.context'

export const LoginVerification = () => {
  const { setStep, verify, setErrorMessage, email } = useLoginModal()
  const { userService } = useDataService()
  const { setUser } = useAuth()

  return (
    <div className="flex flex-col mt-5">
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        onChange={async pin => {
          const { success, email, id } = await verify(pin)
          if (success && id) {
            userService.add({ json: { id, email } })
            setUser({ id, email })
          }
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="p-6" />
          <InputOTPSlot index={1} className="p-6" />
          <InputOTPSlot index={2} className="p-6" />
          <InputOTPSlot index={3} className="p-6" />
          <InputOTPSlot index={4} className="p-6" />
          <InputOTPSlot index={5} className="p-6" />
        </InputOTPGroup>
      </InputOTP>

      <div className="w-full flex flex-col items-end mt-4">
        <Button
          variant="link"
          onClick={() => {
            setStep('EMAIL')
            setErrorMessage('')
          }}
          className="text-sm mr-[-12px] text-destructive/60 hover:text-destructive"
        >
          No llega? Intenta de nuevo
        </Button>
      </div>
    </div>
  )
}
