import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useGetAllGameSessionsBySemester } from "@/services/game-session/GameSessionQueries"
import { useGetCurrentSemester } from "@/services/semester/SemesterQueries"
import { useGetAllGameSessionBookings } from "@/services/admin/game-session/AdminGameSessionQueries"
import { render } from "@/test-config/test-utils"
import { AdminSessions } from "./AdminSessions"

// Mock the hooks
vi.mock("@/services/game-session/GameSessionQueries", () => ({
  useGetAllGameSessionsBySemester: vi.fn(),
}))

vi.mock("@/services/semester/SemesterQueries", () => ({
  useGetCurrentSemester: vi.fn(),
}))

vi.mock("@/services/admin/game-session/AdminGameSessionQueries", () => ({
  useGetAllGameSessionBookings: vi.fn(),
}))

// Mock nuqs
vi.mock("nuqs", () => ({
  parseAsString: vi.fn(),
  useQueryState: vi.fn(() => [null, vi.fn()]),
}))

const mockedUseGetCurrentSemester = vi.mocked(useGetCurrentSemester)
const mockedUseGetAllGameSessionsBySemester = vi.mocked(useGetAllGameSessionsBySemester)
const mockedUseGetAllGameSessionBookings = vi.mocked(useGetAllGameSessionBookings)

describe("<AdminSessions />", () => {
  let Wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element

  beforeEach(() => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    // Mock semester query response
    mockedUseGetCurrentSemester.mockReturnValue({
      data: { data: { id: "semester-123" } },
      isLoading: false,
      error: null,
    } as any)

    // Mock game sessions query response
    mockedUseGetAllGameSessionsBySemester.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    } as any)

    // Mock bookings query response
    mockedUseGetAllGameSessionBookings.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    } as any)

    vi.clearAllMocks()
  })

  it("should use semester-based game session query instead of current sessions", () => {
    render(
      <Wrapper>
        <AdminSessions />
      </Wrapper>
    )

    // Verify that the semester query is called
    expect(mockedUseGetCurrentSemester).toHaveBeenCalled()

    // Verify that the game sessions query is called with semester ID
    expect(mockedUseGetAllGameSessionsBySemester).toHaveBeenCalledWith("semester-123")
  })

  it("should handle empty semester ID gracefully", () => {
    // Mock empty semester response
    mockedUseGetCurrentSemester.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any)

    render(
      <Wrapper>
        <AdminSessions />
      </Wrapper>
    )

    // Verify that the game sessions query is called with empty string
    expect(mockedUseGetAllGameSessionsBySemester).toHaveBeenCalledWith("")
  })
})