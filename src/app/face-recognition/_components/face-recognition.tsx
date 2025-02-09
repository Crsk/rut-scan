'use client'

export type ReferenceImage = {
  url: string
  label: string
  metadata?: { user: UserProps }
}

type DetectionProps = {
  referenceImages: ReferenceImage[]
}

import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
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
  const { setMatchResult, setLastMatch } = useFaceRecognition()
  const intervalRef = useRef<NodeJS.Timeout>(null)
  const [referenceDescriptors, setReferenceDescriptors] = useState<
    Array<{
      descriptor: Float32Array
      label: string
      metadata: { entity: UserProps }
    }>
  >([])

  const loadModels = useCallback(async (): Promise<void> => {
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
  }, [])

  const startVideo = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
    }
  }, [])

  const processReferenceImages = useCallback(async () => {
    const descriptors: Array<{
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
        descriptors.push({
          descriptor: detection.descriptor,
          label: image.label,
          metadata: { entity: image.metadata.user }
        })
      }
    }

    setReferenceDescriptors(descriptors)
  }, [referenceImages])

  const detectFaces = useCallback(async (): Promise<void> => {
    if (!videoRef.current || !canvasRef.current || referenceDescriptors.length === 0) return

    const canvas = canvasRef.current
    const displaySize = {
      width: videoRef.current.videoWidth || 400,
      height: videoRef.current.videoHeight || 400
    }
    matchDimensions(canvas, displaySize)

    const processFaces = async () => {
      const detections = await detectAllFaces(videoRef.current!, new TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()

      const resizedDetections = resizeResults(detections, displaySize)
      const ctx = canvas.getContext('2d')

      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (resizedDetections.length > 0) {
        const currentFaceDescriptor = resizedDetections[0].descriptor
        let bestMatch: MatchResult | null = null
        let faceSimilarityThreshold = 0.6

        for (const refFace of referenceDescriptors) {
          const distance = euclideanDistance(currentFaceDescriptor, refFace.descriptor)

          if (distance < faceSimilarityThreshold) {
            faceSimilarityThreshold = distance
            bestMatch = {
              label: refFace.label,
              distance: distance,
              metadata: refFace.metadata
            }
          }
        }

        if (bestMatch) {
          setMatchResult(bestMatch)
          setLastMatch(bestMatch)
        }

        // Draw face detections
        draw.drawDetections(canvas, resizedDetections)
        draw.drawFaceLandmarks(canvas, resizedDetections)
      } else setMatchResult(null)
    }

    intervalRef.current = setInterval(processFaces, 100)
  }, [referenceDescriptors, setMatchResult, setLastMatch])

  useEffect(() => {
    loadModels()
    const stream = videoRef.current?.srcObject as MediaStream

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [loadModels])

  useEffect(() => {
    if (isModelLoaded && videoRef.current) {
      startVideo()
      processReferenceImages()
    }
  }, [isModelLoaded, startVideo, processReferenceImages])

  useEffect(() => {
    if (isModelLoaded && referenceDescriptors.length > 0) detectFaces()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isModelLoaded, referenceDescriptors, detectFaces])

  return (
    <div className="relative aspect-square">
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

      <div className="absolute">
        {!isModelLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            Cargando...
          </div>
        )}
      </div>
    </div>
  )
}
