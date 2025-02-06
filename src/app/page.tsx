'use client'
import { Button } from '@/components/ui/button'
import { QrCode, UsersIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] pb-36">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <h1 className="text-3xl pb-16">Control de Acceso</h1>
        <div className="flex gap-4">
          <Link href="/scan">
            <Button size="lg">
              <QrCode /> Validar QR
            </Button>
          </Link>

          <Link href="/socios">
            <Button size="lg" variant="secondary">
              <UsersIcon /> Socios
            </Button>
          </Link>
        </div>
      </main>
      <footer></footer>
    </div>
  )
}
