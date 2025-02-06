'use client'
import { useCallback } from 'react'
import { Scanner } from './_components/scanner'

const Page = () => {
  const onNewScanResult = useCallback((decodedText: string) => {
    console.log(decodedText)
  }, [])

  return <Scanner fps={10} qrbox={250} disableFlip={true} qrCodeSuccessCallback={onNewScanResult} />
}

export default Page
