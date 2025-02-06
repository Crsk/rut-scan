import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Page from '@/app/socios/[rut]/page'
import { useParams } from 'next/navigation'
import { useUserByRut } from '@/domain/users/hooks/use-user-by-rut'

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ rut: '12345678-9' })),
  useRouter: vi.fn(() => ({ push: vi.fn() }))
}))

vi.mock('@/domain/users/hooks/use-user-by-rut', () => ({
  useUserByRut: vi.fn(({ rut }) => ({
    data:
      rut === '12345678-9'
        ? {
            name: 'Bob Toronja',
            rut: '12345678-9',
            roles: ['PARTNER']
          }
        : null,
    isPending: false
  }))
}))

describe('Partner Details Page', () => {
  it('should display loading state initially', () => {
    vi.mocked(useUserByRut).mockReturnValueOnce({
      data: null,
      isPending: true,
      error: null,
      isFetching: true
    })

    render(<Page />)
    expect(screen.getByText('Buscando...')).toBeInTheDocument()
  })

  it('should display partner information when found', () => {
    render(<Page />)
    expect(screen.getByText('Bob Toronja')).toBeInTheDocument()
    expect(screen.getByText('12345678-9')).toBeInTheDocument()
    expect(screen.getByText('Socio encontrado')).toBeInTheDocument()
  })

  it('should display not found message for non-existent partner', () => {
    vi.mocked(useParams).mockReturnValueOnce({ rut: '98765432-1' })
    render(<Page />)
    expect(screen.getByText('Socio no encontrado')).toBeInTheDocument()
    expect(screen.getByText('RUT: 98765432-1')).toBeInTheDocument()
  })
})
