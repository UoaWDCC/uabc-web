import { Gender, PlayLevel } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
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

const mockUser: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  playLevel: "beginner",
  gender: "male",
  dietaryRequirements: "None",
  role: "member",
  updatedAt: "2023-01-01T00:00:00.000Z",
  createdAt: "2023-01-01T00:00:00.000Z",
}

const mockAuth: AuthContextValue = {
  user: mockUser,
  isLoading: false,
  isPending: false,
  error: null,
  token: "mock-token",
  isAvailable: true,
  login: {} as never,
  emailVerificationCode: {} as never,
  register: {} as never,
}

describe("<ProfileSection />", () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders profile details and additional info panels", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileSection auth={mockAuth} />
      </QueryClientProvider>,
    )
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

    const { user } = render(
      <QueryClientProvider client={queryClient}>
        <ProfileSection auth={mockAuth} />
      </QueryClientProvider>,
    )

    const editButton = screen.getAllByText(/Edit/i)[0]

    await user.click(editButton)
    await user.clear(screen.getByLabelText(/First Name/i))
    await user.type(screen.getByLabelText(/First Name/i), "Jane")
    await user.click(screen.getByText(/Save changes/i))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Jane",
          lastName: mockUser.lastName,
          phoneNumber: mockUser.phoneNumber,
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

    const { user } = render(
      <QueryClientProvider client={queryClient}>
        <ProfileSection auth={mockAuth} />
      </QueryClientProvider>,
    )

    await user.click(screen.getAllByRole("button", { name: /edit/i })[1])
    const genderInput = screen.getByRole("combobox", { name: /enter your gender/i })
    await user.click(genderInput)
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Enter}")
    const playLevelInput = screen.getByRole("combobox", { name: /play level/i })
    await user.click(playLevelInput)
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Enter}")
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue(Gender.other)).toBeInTheDocument()
      expect(screen.getByDisplayValue(PlayLevel.intermediate)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          gender: Gender.other,
          playLevel: PlayLevel.intermediate,
          dietaryRequirements: mockUser.dietaryRequirements,
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

    const { user } = render(
      <QueryClientProvider client={queryClient}>
        <ProfileSection auth={mockAuth} />
      </QueryClientProvider>,
    )

    const editButton = screen.getAllByText(/Edit/i)[0]

    await user.click(editButton)
    await user.type(screen.getByLabelText(/First Name/i), "Error")
    await user.click(screen.getByText(/Save changes/i))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled()
    })
  })
})
