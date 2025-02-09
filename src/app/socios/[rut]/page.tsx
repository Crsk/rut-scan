'use client'
import { useParams } from 'next/navigation'
import { useUserByRut } from '@/domain/users/hooks/use-user-by-rut'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HomeIcon, QrCode } from 'lucide-react'

const Page = () => {
  const { rut } = useParams<{ rut: string }>()
  const { data: partner, isPending } = useUserByRut({ rut })

  if (isPending)
    return (
      <div className="fixed overflow-hidden w-screen h-screen bg-zinc-900 text-zinc-100 pb-20 transition-all duration-500">
        <div className="flex flex-col h-full justify-center items-center gap-16">
          <h1 className="text-3xl font-bold pb-32">Buscando...</h1>
        </div>
      </div>
    )

  if (partner)
    return (
      <div className="fixed overflow-hidden w-screen h-screen bg-emerald-700 text-emerald-100 pb-20 transition-all duration-500">
        <div className="flex flex-col h-full justify-center items-center gap-16">
          <div className="flex flex-col items-center gap-4">
            <img src={partner.imageUrl || undefined} alt={partner.name} className="w-24 h-24 rounded-full" />
            <h1 className="text-3xl font-bold">{partner.name}</h1>
            <div className="flex flex-col items-center">
              <p>✅ Socio encontrado</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="secondary">
                <HomeIcon /> Inicio
              </Button>
            </Link>
            <Link href="/scan">
              <Button variant="secondary">
                <QrCode /> Escanear otro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )

  if (!partner)
    return (
      <div className="fixed overflow-hidden w-screen h-screen bg-red-700 text-red-100 pb-20 transition-all duration-500">
        <div className="flex flex-col h-full justify-center items-center gap-16">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold">Socio no encontrado</h1>
            <p>RUT: {rut}</p>
          </div>
          <div className="flex gap-8 items-center flex-col md:flex-row ">
            <Link href="/">
              <Button variant="secondary">
                <HomeIcon /> Inicio
              </Button>
            </Link>

            <Link href="/scan">
              <Button variant="secondary">
                <QrCode /> Intenta de nuevo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
}

export default Page
