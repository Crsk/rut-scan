'use client'
import { AuthProvider } from '@/contexts/auth/auth.context'
import { DataServiceProvider } from '@/contexts/service/data.context'
import { LoginModalProvider } from '@/components/app/login/context/login-modal.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateAdminModalProvider } from '@/components/app/create-admin/context/create-admin-modal.context'

export const ClientProviders = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <AuthProvider>
      <DataServiceProvider>
        <QueryClientProvider client={queryClient}>
          <LoginModalProvider>
            <CreateAdminModalProvider>{children}</CreateAdminModalProvider>
          </LoginModalProvider>
        </QueryClientProvider>
      </DataServiceProvider>
    </AuthProvider>
  )
}
