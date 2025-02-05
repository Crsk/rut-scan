'use client'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoginEmail } from '@/components/app/login/login-email'
import { LoginVerification } from '@/components/app/login/login-verification'
import { useLoginModal } from '@/components/app/login/context/login-modal.context'

export const LoginDialog = () => {
  const { errorMessage, step, email, open, setOpen } = useLoginModal()

  const variants = useMemo(() => {
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'EMAIL' ? 'Login' : step === 'VERIFICATION' ? 'Verificación' : 'Opps, algo salió mal'}
          </DialogTitle>
          <DialogDescription>
            {step === 'EMAIL'
              ? 'Ingresa tu e-mail para recibir un código de acceso'
              : step === 'VERIFICATION'
                ? `Código enviado a ${email}`
                : 'Opps, algo salió mal'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full max-w-96 items-center place-self-center my-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {(step === 'EMAIL' || step === 'ERROR') && <LoginEmail />}
              {step === 'VERIFICATION' && <LoginVerification />}
              {errorMessage ? (
                <p className="text-red-9 dark:reddark-9 text-sm pt-4 w-full flex justify-end">{errorMessage}</p>
              ) : (
                <></>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
