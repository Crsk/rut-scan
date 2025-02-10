'use client'
import { useCallback, useEffect, useState } from 'react'
import { getRunFromUrl } from './_utils/get-run-from-url'
import { useUserByRut } from '@/domain/users/hooks/use-user-by-rut'
import { useRouter } from 'next/navigation'
import { Scanner } from '@yudiel/react-qr-scanner'

const Page = () => {
  const [rut, setRut] = useState<string>('')
  const { data: partner } = useUserByRut({ rut })
  const { push } = useRouter()
  const [scanned, setScanned] = useState<boolean>(false)
  const [pause, setPause] = useState(false)

  const onNewScanResult = useCallback((decodedText: string) => {
    if (!decodedText) return

    setPause(true)
    setScanned(true)

    try {
      const RUN = getRunFromUrl(decodedText)
      if (RUN) setRut(RUN)
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setPause(false)
    }
  }, [])

  useEffect(() => {
    if (!scanned || pause) return

    if (partner) push(`/socios/${partner.rut}`)
    else push(`/socios/${rut}`)
  }, [partner, setScanned, push, rut, scanned, pause])

  return (
    <div className="pt-20 flex justify-center">
      {!pause && (
        <div className="absolute flex items-center justify-center z-10 w-full h-full max-w-[400px] max-h-[400px]">
          <div className="relative w-64 h-64">
            {/* Scanner corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white rounded-br-xl" />
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full animate-scan">
              <div className="h-px bg-white border-1"></div>
            </div>
          </div>
        </div>
      )}
      <Scanner
        formats={['qr_code']}
        onScan={detectedCodes => onNewScanResult(detectedCodes[0].rawValue)}
        onError={error => console.log(`onError: ${error}'`)}
        styles={{ container: { maxHeight: '400px', maxWidth: '400px' } }}
        components={{
          audio: true,
          onOff: false,
          torch: true,
          zoom: true,
          finder: false
        }}
        allowMultiple={true}
        scanDelay={2000}
        paused={pause}
      />
    </div>
  )
}

export default Page
