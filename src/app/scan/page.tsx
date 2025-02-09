'use client'
import { useCallback, useEffect, useState } from 'react'
import { getRunFromUrl } from './_utils/get-run-from-url'
import { useUserByRut } from '@/domain/users/hooks/use-user-by-rut'
import { useRouter } from 'next/navigation'
import QRScanner from '@/app/scan/_components/scanner'

const Page = () => {
  const [rut, setRut] = useState<string>('')
  const { data: partner } = useUserByRut({ rut })
  const { push } = useRouter()
  const [scanned, setScanned] = useState<boolean>(false)

  const onNewScanResult = useCallback((decodedText: string) => {
    if (!decodedText) return

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
      <QRScanner onScan={result => onNewScanResult(result)} />
    </div>
  )
}

export default Page
