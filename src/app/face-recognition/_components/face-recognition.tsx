'use client'

export type ReferenceImage = {
  url: string
  label: string
  metadata?: { user: UserProps }
}

type DetectionProps = {
  referenceImages: ReferenceImage[]
}

import React, { FC, useEffect, useRef, useState } from 'react'
import {
  nets,
  fetchImage,
  detectSingleFace,
  TinyFaceDetectorOptions,
  matchDimensions,
  detectAllFaces,
  resizeResults,
  euclideanDistance,
  draw
} from 'face-api.js'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { useFaceRecognition } from './face-recognition.context'
import { MatchResult } from './face-recognition.context'

export const FaceRecognition: FC<DetectionProps> = ({ referenceImages }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const { matchResult, setMatchResult, setLastMatch } = useFaceRecognition()

  useEffect(() => {
    const loadModels = async (): Promise<void> => {
      try {
        await Promise.all([
          nets.tinyFaceDetector.loadFromUri('/models'),
          nets.faceLandmark68Net.loadFromUri('/models'),
          nets.faceRecognitionNet.loadFromUri('/models')
        ])
        setIsModelLoaded(true)
      } catch (error) {
        console.error('Error loading models:', error)
      }
    }

    loadModels()
  }, [])

  useEffect(() => {
    if (isModelLoaded && videoRef.current) startVideo()
  }, [isModelLoaded])

  const startVideo = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
    }
  }

  const processReferenceImages = async () => {
    const referenceDescriptors: Array<{
      descriptor: Float32Array
      label: string
      metadata: { entity: UserProps }
    }> = []

    for (const image of referenceImages) {
      const img = await fetchImage(image.url)
      const detection = await detectSingleFace(img, new TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (detection && image.metadata) {
        referenceDescriptors.push({
          descriptor: detection.descriptor,
          label: image.label,
          metadata: { entity: image.metadata.user }
        })
      }
    }

    return referenceDescriptors
  }

  const detectFaces = async (): Promise<void> => {
    if (!videoRef.current || !canvasRef.current) return

    const referenceDescriptors = await processReferenceImages()

    const canvas = canvasRef.current
    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight
    }
    matchDimensions(canvas, displaySize)

    setInterval(async () => {
      const detections = await detectAllFaces(videoRef.current!, new TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()

      const resizedDetections = resizeResults(detections, displaySize)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      if (resizedDetections.length > 0) {
        /* setDetectedFace(resizedDetections[0]) */

        // Compare with reference images
        const currentFaceDescriptor = resizedDetections[0].descriptor
        let bestMatch: MatchResult | null = null
        let faceSimilarityTgreashold = 0.6

        for (const refFace of referenceDescriptors) {
          const distance = euclideanDistance(currentFaceDescriptor, refFace.descriptor)

          if (distance < faceSimilarityTgreashold) {
            faceSimilarityTgreashold = distance
            bestMatch = {
              label: refFace.label,
              distance: distance,
              metadata: refFace.metadata
            }
            setMatchResult(bestMatch)
            setLastMatch(bestMatch)
          }
        }

        // Draw face detections
        draw.drawDetections(canvas, resizedDetections)
        draw.drawFaceLandmarks(canvas, resizedDetections)
      } else {
        /* setDetectedFace(null) */
        setMatchResult(null)
      }
    }, 100)
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onPlay={detectFaces}
        className="w-full"
        style={{ objectFit: 'cover' }}
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full" />

      <div className="">
        {matchResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
            <p>✅ {matchResult.metadata.entity.rut}</p>
          </div>
        )}
        {!isModelLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            Cargando...
          </div>
        )}
      </div>
    </div>
  )
}
