import { casualUserMock } from "@repo/shared/mocks"
import { mockAuthContextValue } from "@repo/shared/mocks/Authentication.mock"
import { Gender, PlayLevel, University } from "@repo/shared/types"
import type { AuthContextValueWithUser } from "@repo/shared/types/auth"
import { mockOnboardingGlobal } from "@repo/ui/test-config/mocks/CasualInfoForm.mock"
import { render, screen } from "@repo/ui/test-utils"
import { OnboardingSection } from "./OnboardingSection"

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuthContextValue,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockMutateAsync = vi.fn()
vi.mock("@/services/auth/AuthMutations", () => ({
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
    render(
      <OnboardingSection auth={mockAuthContextValue} onboardingGlobal={mockOnboardingGlobal} />,
    )
    expect(screen.getByText("Basic Info")).toBeInTheDocument()
  })

  it("should call handleComplete when registration is complete", async () => {
    const { user } = render(
      <OnboardingSection auth={mockAuthContextValue} onboardingGlobal={mockOnboardingGlobal} />,
    )

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

  it("should handle when user is missing fields", () => {
    const mockAuthMissingFields: AuthContextValueWithUser = {
      ...mockAuthContextValue,
      user: {
        ...casualUserMock,
        firstName: "",
        lastName: null,
        phoneNumber: null,
        university: null,
        studentId: null,
        studentUpi: null,
        gender: null,
        playLevel: null,
        dietaryRequirements: null,
      },
    }

    render(
      <OnboardingSection auth={mockAuthMissingFields} onboardingGlobal={mockOnboardingGlobal} />,
    )
    expect(screen.getByText("Casual member information")).toBeInTheDocument()
  })

  it("should handle user with only phoneNumber present", () => {
    const userWithOnlyPhone: AuthContextValueWithUser = {
      ...mockAuthContextValue,
      user: {
        ...casualUserMock,
        firstName: "",
        lastName: null,
        phoneNumber: "021 123 4567",
        university: null,
        studentId: null,
        studentUpi: null,
        gender: null,
        playLevel: null,
        dietaryRequirements: null,
      },
    }

    render(<OnboardingSection auth={userWithOnlyPhone} onboardingGlobal={mockOnboardingGlobal} />)
    expect(screen.getByText("Basic Info")).toBeInTheDocument()
  })

  it("should handle user with only gender present", () => {
    const userWithOnlyGender: AuthContextValueWithUser = {
      ...mockAuthContextValue,
      user: {
        ...casualUserMock,
        firstName: "",
        lastName: null,
        phoneNumber: null,
        university: null,
        studentId: null,
        studentUpi: null,
        gender: Gender.female,
        playLevel: null,
        dietaryRequirements: null,
      },
    }

    render(<OnboardingSection auth={userWithOnlyGender} onboardingGlobal={mockOnboardingGlobal} />)
    expect(screen.getByText("Basic Info")).toBeInTheDocument()
  })

  it("should handle user with university and gender but no name", () => {
    const userWithUniversityAndGender: AuthContextValueWithUser = {
      ...mockAuthContextValue,
      user: {
        ...casualUserMock,
        firstName: "",
        lastName: null,
        phoneNumber: null,
        university: University.uoa,
        studentId: "123456",
        studentUpi: "abc123",
        gender: Gender.male,
        playLevel: PlayLevel.intermediate,
        dietaryRequirements: "None",
      },
    }

    render(
      <OnboardingSection
        auth={userWithUniversityAndGender}
        onboardingGlobal={mockOnboardingGlobal}
      />,
    )
    expect(screen.getByText("Basic Info")).toBeInTheDocument()
  })
})
