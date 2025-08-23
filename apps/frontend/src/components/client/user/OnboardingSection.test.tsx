import { casualUserMock } from "@repo/shared/mocks"
import { Gender, PlayLevel, University } from "@repo/shared/types"
import { render, screen } from "@repo/ui/test-utils"
import type { AuthContextValueWithUser } from "@/context/RoleWrappers"
import { OnboardingSection } from "./OnboardingSection"

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockAuth: AuthContextValueWithUser = {
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
  logout: {} as never,
}

const mockMutateAsync = vi.fn()
vi.mock("@/services/auth/useUpdateSelfMutation", () => ({
  useUpdateSelfMutation: () => ({
    mutateAsync: mockMutateAsync,
    isLoading: false,
    error: null,
  }),
}))

describe("<OnboardingSection />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the register flow component", () => {
    render(<OnboardingSection auth={mockAuth} />)
    expect(screen.getByText("Basic Info")).toBeInTheDocument()
  })

  it("should call handleComplete when registration is complete", async () => {
    const { user } = render(<OnboardingSection auth={mockAuth} />)

    // Basic Info Form 1
    await user.click(screen.getByText("Continue"))

    // Basic Info Form 2
    await user.type(screen.getByTestId("phone-number"), "021 234 5678")
    await user.click(screen.getByText("Continue"))

    // University Info Form
    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.uoa))
    await user.type(screen.getByTestId("student-id"), "610855188")
    await user.type(screen.getByTestId("student-upi"), "bond007")
    await user.click(screen.getByText("Continue"))

    // Additional Info Form
    await user.click(screen.getByTestId("gender"))
    await user.click(screen.getByText(Gender.female))
    await user.click(screen.getByTestId("skill-level"))
    await user.click(screen.getByText(PlayLevel.advanced))
    await user.click(screen.getByText("Continue"))

    // Casual Info Form
    await user.click(await screen.findByTestId("agree"))
    await user.click(screen.getByText("Continue"))

    expect(mockMutateAsync).toHaveBeenCalledWith({
      firstName: "straight",
      lastName: "zhao",
      phoneNumber: "021 234 5678",
      university: University.uoa,
      studentId: "610855188",
      studentUpi: "bond007",
      gender: Gender.female,
      playLevel: PlayLevel.advanced,
      dietaryRequirements: "Peanut",
    })
  }, 10_000)
})
