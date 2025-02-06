'use client'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useCreateAdminModal } from '@/components/app/create-admin/context/create-admin-modal.context'
import { useAddUser } from '@/domain/users/hooks/use-add-user'

export const CreateAdminDialog = () => {
  const { open, setOpen } = useCreateAdminModal()
  const { mutate: addUser } = useAddUser()
  const [email, setEmail] = useState('')

  const variants = useMemo(() => {
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    }
  }, [])

  const createAdmin = () => {
    // TODO: this does not authenticate the user
    addUser({ json: { email, roles: ['ADMIN', 'PARTNER'] } })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Admin</DialogTitle>
          <DialogDescription>El siguiente email tendrá privilegios de administración</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full max-w-96 items-center place-self-center my-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="create-admin"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-4">
                <Input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <Button onClick={createAdmin}>
                  <Send /> Listo!
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
