import { casualUserMock } from "@repo/shared/mocks"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { vi } from "vitest"
import type { AuthContextValue } from "@/context/AuthContext"
import * as useUpdateSelfMutationModule from "@/services/auth/useUpdateSelfMutation"
import { ProfileSection } from "./ProfileSection"

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockAuth: AuthContextValue = {
  user: casualUserMock,
  isLoading: false,
  isPending: false,
  error: null,
  token: "mock-token",
  isAvailable: true,
  login: {} as never,
  emailVerificationCode: {} as never,
  register: {} as never,
  setToken: {} as never,
}

const queryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe("<ProfileSection />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders profile details and additional info panels", () => {
    render(<ProfileSection auth={mockAuth} />, {
      wrapper: queryClientProvider,
    })
    expect(screen.getByText("Profile Details")).toBeInTheDocument()
    expect(screen.getByText("Additional Info")).toBeInTheDocument()
  })

  it("calls mutation on profile details save", async () => {
    const mutateAsync = vi.fn().mockResolvedValue({})
    vi.spyOn(useUpdateSelfMutationModule, "useUpdateSelfMutation").mockReturnValue({
      mutateAsync,
      mutate: mutateAsync,
      error: null,
      data: undefined,
      reset: vi.fn(),
      variables: undefined,
      status: "idle",
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    })

    const { user } = render(<ProfileSection auth={mockAuth} />, {
      wrapper: queryClientProvider,
    })

    await user.click(screen.getAllByText(/Edit/i)[0])
    await user.clear(screen.getByLabelText(/First Name/i))
    await user.type(screen.getByLabelText(/First Name/i), "Jane")
    await user.click(screen.getByText(/Save changes/i))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Jane",
          lastName: casualUserMock.lastName,
        }),
      )
    })
  })

  it("calls mutation on additional info save", async () => {
    const mutateAsync = vi.fn().mockResolvedValue({})
    vi.spyOn(useUpdateSelfMutationModule, "useUpdateSelfMutation").mockReturnValue({
      mutateAsync,
      mutate: mutateAsync,
      error: null,
      data: undefined,
      reset: vi.fn(),
      variables: undefined,
      status: "idle",
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    })

    const { user } = render(<ProfileSection auth={mockAuth} />, {
      wrapper: queryClientProvider,
    })

    await user.click(screen.getAllByText(/Edit/i)[1])
    await user.clear(screen.getByLabelText(/Dietary Requirements/i))
    await user.type(screen.getByLabelText(/Dietary Requirements/i), "Test")
    await user.click(screen.getByText(/Save changes/i))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          gender: casualUserMock.gender,
          playLevel: casualUserMock.playLevel,
          dietaryRequirements: "Test",
        }),
      )
    })
  })

  it("handles mutation error", async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error("Update failed"))
    vi.spyOn(useUpdateSelfMutationModule, "useUpdateSelfMutation").mockReturnValue({
      mutateAsync,
      mutate: mutateAsync,
      error: null,
      data: undefined,
      reset: vi.fn(),
      variables: undefined,
      status: "idle",
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    })

    const { user } = render(<ProfileSection auth={mockAuth} />, {
      wrapper: queryClientProvider,
    })

    const editButton = screen.getAllByText(/Edit/i)[0]

    await user.click(editButton)
    await user.type(screen.getByLabelText(/First Name/i), "Error")
    await user.click(screen.getByText(/Save changes/i))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled()
    })
  })
})
