// @vitest-environment jsdom

import { render, screen } from "@/test-config/test-utils"
import ClientSessionPage from "./client-page"

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
    }
  },
}))

vi.mock("next-auth/react", () => {
  const originalModule = vi.importMock("next-auth/react")
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
      return { data: mockSession, status: "authenticated" }
    }),
  }
})

vi.mock("@/hooks/query/game-sessions", () => ({
  useCurrentGameSessions: () => ({
    data: [
      {
        id: 1,
        date: "2024-03-20",
        startTime: "18:00",
        endTime: "20:00",
        locationName: "Test Location",
        locationAddress: "123 Test St",
        memberCapacity: 20,
        casualCapacity: 10,
        memberBookingCount: 0,
        casualBookingCount: 0,
      },
    ],
    isLoading: false,
  }),
}))

describe("Select Sessions page", () => {
  beforeEach(() => {
    render(<ClientSessionPage isMember={true} prepaidSessions={2} />)
  })

  it("should initially render the button as disabled", () => {
    const button = screen.getByRole("button", { name: "Next" })

    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
