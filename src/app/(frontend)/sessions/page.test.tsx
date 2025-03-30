// @vitest-environment jsdom

import { render, screen, userEvent } from '@/tests-frontend-utils/test-utils'
import ClientSessionPage from './client-page'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
    }
  },
}))

vi.mock('next-auth/react', () => {
  const originalModule = vi.importMock('next-auth/react')
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: {
      verified: true,
    },
  }
  return {
    __esModule: true,
    ...originalModule,
    useSession: vi.fn(() => {
      return { data: mockSession, status: 'authenticated' }
    }),
  }
})

describe('Select Sessions page', () => {
  beforeEach(() => {
    render(<ClientSessionPage isMember={true} prepaidSessions={2} />)
  })

  it('should initially render the button as disabled', () => {
    const button = screen.getByRole('button', { name: 'Next' })

    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
