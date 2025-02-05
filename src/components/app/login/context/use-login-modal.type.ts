export type UseLoginModal = {
  setEmail: (email: string) => void
  email: string
  errorMessage: string | null
  setErrorMessage: (message: string | null) => void
  step: 'EMAIL' | 'VERIFICATION' | 'ERROR'
  setStep: (step: 'EMAIL' | 'VERIFICATION' | 'ERROR') => void
  sendCode: () => void
  verify: (code: string) => Promise<{ success: boolean; email: string; id: string | null }>
  open: boolean
  setOpen: (value: boolean) => void
}
