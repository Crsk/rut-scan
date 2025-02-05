'use client'
import { AuthProvider } from '@/contexts/auth/auth.context'
import { DataServiceProvider } from '@/contexts/service/data.context'
import { LoginModalProvider } from '@/components/app/login/context/login-modal.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const ClientProviders = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <AuthProvider>
      <DataServiceProvider>
        <LoginModalProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </LoginModalProvider>
      </DataServiceProvider>
    </AuthProvider>
  )
}
