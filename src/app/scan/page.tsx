'use client'
import { useCallback, useEffect, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { getRunFromUrl } from './_utils/get-run-from-url'
import { useUserByRut } from '@/domain/users/hooks/use-user-by-rut'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [rut, setRut] = useState<string>('')
  const { data: partner } = useUserByRut({ rut })
  const { push } = useRouter()
  const [scanned, setScanned] = useState<boolean>(false)

  const onNewScanResult = useCallback((decodedText: string) => {
    const RUN = getRunFromUrl(decodedText)
    if (RUN) setRut(RUN)

    setScanned(true)
  }, [])

  useEffect(() => {
    if (!scanned) return

    if (partner) push(`/socios/${partner.rut}`)
    else push(`/socios/${rut}`)
  }, [partner, setScanned, push, rut, scanned])

  return (
    <div className="pt-20">
      <Scanner onScan={result => onNewScanResult(result[0].rawValue)} />
    </div>
  )
}

export default Page
