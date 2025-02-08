import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Button } from '@/components/ui/button'

interface QRScannerProps {
  onScan: (data: string) => void
}

type PermissionState = 'prompt' | 'granted' | 'denied'

interface VideoElement extends HTMLVideoElement {
  srcObject: MediaStream | null
}

const QRScanner: FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<VideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState<boolean>(false)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('prompt')

  const startCamera = useCallback(async () => {
    try {
      let stream: MediaStream | null = null
      const constraints: MediaStreamConstraints = { video: { facingMode: 'environment' } }

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (err) {
        console.log('Failed to get environment camera, trying default...', { err })
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream
        setScanning(true)
        setError(null)
      }
    } catch (err) {
      handleCameraError(err as Error)
    }
  }, [])

  const checkPermissions = useCallback(async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        // Using "camera" as string literal since TypeScript's built-in PermissionName
        // doesn't include "camera" yet
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName })
        setPermissionStatus(result.state as PermissionState)

        result.addEventListener('change', () => {
          setPermissionStatus(result.state as PermissionState)
          if (result.state === 'granted') {
            startCamera()
          } else if (result.state === 'denied') {
            setError('Permiso de cámara fue rechazado. Por favor permite el acceso en las opciones del navegador.')
          }
        })
      }
    } catch (err) {
      console.log('Permission query not supported', { err })
    }
  }, [startCamera])

  const handleCameraError = (err: Error & { name?: string }) => {
    let errorMessage = 'Error al acceder a la cámara: '

    switch (err.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        errorMessage += 'Permiso denegado. Por favor permite el acceso a la cámara.'
        break
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        errorMessage += 'Cámara no encontrada.'
        break
      case 'NotReadableError':
      case 'TrackStartError':
        errorMessage += 'La Cámara está siendo usada por otra aplicación'
        break
      case 'SecurityError':
        errorMessage += 'Conexión no segura. HTTPS requerido.'
        break
      default:
        errorMessage += err.message || 'Error desconocido.'
    }

    setError(errorMessage)
    setScanning(false)
  }

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) onScan(code.data)
    }

    if (scanning) requestAnimationFrame(scanQRCode)
  }, [onScan, scanning])

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost'
    ) {
      setError('Error conexión no segura. HTTPS es requerido.')

      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Navegador no soportado. Por favor intenta otro.')

      return
    }

    checkPermissions()
    startCamera()
    const currentVideoRef = videoRef.current

    return () => {
      setScanning(false)
      if (currentVideoRef && currentVideoRef.srcObject) {
        const tracks = (currentVideoRef.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [videoRef, startCamera, checkPermissions])

  useEffect(() => {
    if (scanning) scanQRCode()
  }, [scanning, scanQRCode])

  const requestCameraPermission = async () => {
    try {
      await startCamera()
    } catch (err) {
      handleCameraError(err as Error)
    }
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          onPlay={() => setScanning(true)}
        />

        {/* Scanning Overlay */}
        {scanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-20 h-20">
              {/* Scanner corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white rounded-br-xl" />

              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 w-full animate-scan">
                <div className="h-px bg-white border-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* Permission/Error States */}
        {!scanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            {error ? (
              <div className="text-center p-6">
                <p className="text-red-400 mb-4">{error}</p>
                {permissionStatus === 'denied' && (
                  <Button onClick={() => window.location.reload()}>Intenta de nuevo</Button>
                )}
              </div>
            ) : (
              permissionStatus === 'prompt' && <Button onClick={requestCameraPermission}>Habilitar Cámara</Button>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default QRScanner
