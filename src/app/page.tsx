'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/auth.context'
import Link from 'next/link'

export default function Home() {
  const { authUser } = useAuth()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] pb-36">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <h1 className="text-3xl">Control de Acceso</h1>
        <div className="flex gap-4">
          <Link href="/scan">
            <Button size="lg">Validar QR</Button>
          </Link>

          {authUser?.email && (
            <Button size="lg" variant="secondary">
              <Link href="/socios">Administrar Socios</Link>
            </Button>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  )
}
