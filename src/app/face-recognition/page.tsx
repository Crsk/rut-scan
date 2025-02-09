'use client'
import { useMemo } from 'react'
import { useUsers } from '@/domain/users/hooks/use-users'
import { FaceRecognition, ReferenceImage } from './_components/face-recognition'
import { useFaceRecognition } from './_components/face-recognition.context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HomeIcon, ScanFaceIcon } from 'lucide-react'

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
          backgroundColor: lastMatch ? 'oklch(50.8% 0.1447 165.612)' : 'black',
          color: lastMatch ? 'oklch(0.95 0.052 163.051)' : 'white'
        }}
      >
        <div className="flex flex-col items-center justify-center pt-64">
          {lastMatch ? (
            <div className="flex flex-col items-center justify-center gap-4 h-32">
              <img
                src={lastMatch.metadata.entity.imageUrl || undefined}
                alt={lastMatch.metadata.entity.name}
                className="w-24 h-24 rounded-full"
              />
              <h1 className="text-xl font-bold">{lastMatch.metadata.entity.name}</h1>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 h-32">
              <h1 className="text-lg font-medium">No reconocido</h1>
            </div>
          )}

          <div className="flex gap-4 items-center flex-col md:flex-row pt-8">
            <Button onClick={reset} variant="secondary">
              <ScanFaceIcon />
              Reset
            </Button>
            <Link href="/">
              <Button variant="secondary">
                <HomeIcon />
                Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
