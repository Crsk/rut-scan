'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <h1 className="text-3xl">Control de Acceso</h1>
        <div className="flex gap-4">
          <Button size="lg">Validar Acceso</Button>

          {user?.email && (
            <Button size="lg" variant="secondary">
              Administrar Socios
            </Button>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  )
}
