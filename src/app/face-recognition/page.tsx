'use client'
import { useMemo } from 'react'
import { useUsers } from '@/domain/users/hooks/use-users'
import { FaceRecognition, ReferenceImage } from './_components/face-recognition'
import { useFaceRecognition } from './_components/face-recognition.context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye, HomeIcon, QrCode, ScanFaceIcon } from 'lucide-react'

const Page = () => {
  const { data: users } = useUsers()
  const referenceImages: ReferenceImage[] | undefined = useMemo(
    () =>
      users
        ?.filter(user => !!user.imageUrl)
        ?.map(user => ({ url: user.imageUrl!, label: user.name!, metadata: { user } }) as ReferenceImage),
    [users]
  )
  const { lastMatch, reset } = useFaceRecognition()

  if (!referenceImages) return <>Cargando...</>

  return (
    <>
      <div className="absolute">
        <FaceRecognition referenceImages={referenceImages} />
      </div>
      <div
        className="h-screen flex flex-col items-center justify-center"
        style={{
          backgroundColor: lastMatch ? 'oklch(50.8% 0.1447 165.612)' : 'oklch(50.5% 0.2317 27.518)',
          color: lastMatch ? 'oklch(0.95 0.052 163.051)' : 'oklch(0.936 0.032 17.717)'
        }}
      >
        <div className="flex flex-col items-center justify-center pt-64">
          {lastMatch ? (
            <div className="flex flex-col items-center justify-center gap-4 h-48">
              <img
                src={lastMatch.metadata.entity.imageUrl || undefined}
                alt={lastMatch.metadata.entity.name}
                className="w-24 h-24 rounded-full"
              />
              <h1 className="text-3xl font-bold">{lastMatch.metadata.entity.name}</h1>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 h-48">
              <h1 className="text-lg font-medium">No reconocido</h1>
            </div>
          )}

          <div className="flex gap-4 items-center flex-col md:flex-row pt-8">
            <Button onClick={reset} size="lg">
              <ScanFaceIcon />
              Reset
            </Button>
            <Link href="/">
              <Button variant="secondary">
                <HomeIcon />
                Inicio
              </Button>
            </Link>
            <Link href="/socios">
              <Button variant="secondary">
                <Eye /> Lista de socios
              </Button>
            </Link>

            <Link href="/scan">
              <Button variant="secondary">
                <QrCode /> Validar QR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
