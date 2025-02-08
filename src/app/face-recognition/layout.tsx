import { FaceRecognitionProvider } from './_components/face-recognition.context'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <FaceRecognitionProvider>{children}</FaceRecognitionProvider>
}
