import { MembershipType } from "@repo/shared"
import { memberUserMock } from "@repo/shared/mocks"
import type { SessionItem } from "@repo/ui/components/Composite"
import * as usePopupStateModule from "@repo/ui/hooks"
import { render, screen } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { vi } from "vitest"
import { BookFlow } from "./BookFlow"

vi.mock("@repo/ui/hooks", () => ({
  usePopupState: vi.fn(() => ({
    open: vi.fn(),
  })),
}))

const mockAuth = {
  user: memberUserMock,
  isLoading: false,
  isPending: false,
  error: null,
  token: "mock-token",
  isAvailable: true,
  login: {} as never,
  emailVerificationCode: {} as never,
  register: {} as never,
  setToken: {} as never,
} as const

// TODO: FIX THIS TESTS
describe.skip("<BookFlow />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render BookACourt component on initial step", () => {
    render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    // Check if BookACourt component is rendered
    expect(screen.getByText("Beginner")).toBeInTheDocument()
    expect(screen.getByText("Intermediate")).toBeInTheDocument()
    expect(screen.getByText("Advanced")).toBeInTheDocument()
  })

  it("should show empty state when no bookings are available", () => {
    // Mock empty bookings by temporarily modifying the component
    const originalBookings = (BookFlow as unknown as { bookings: SessionItem[] }).bookings
    ;(BookFlow as unknown as { bookings: SessionItem[] }).bookings = []

    render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    expect(screen.getByText("No bookings found")).toBeInTheDocument()
    expect(screen.getByText("There are no bookings available at the moment.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go back to profile" })).toBeInTheDocument()

    // Restore original bookings
    ;(BookFlow as unknown as { bookings: SessionItem[] }).bookings = originalBookings
  })

  it("should show empty state when user has no remaining sessions", () => {
    const authWithNoSessions = {
      ...mockAuth,
      user: {
        ...mockAuth.user,
        remainingSessions: 0,
      },
    }

    render(<BookFlow auth={authWithNoSessions} />, { wrapper: withNuqsTestingAdapter() })

    expect(screen.getByText("No remaining sessions")).toBeInTheDocument()
    expect(screen.getByText("You have no remaining sessions.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go back to profile" })).toBeInTheDocument()
  })

  it("should handle play level selection and move to next step", async () => {
    const { user } = render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    const beginnerButton = screen.getByRole("button", { name: "beginner" })
    await user.click(beginnerButton)

    expect(screen.getByText("Select a Court")).toBeInTheDocument()
  })

  it("should handle court selection and move to confirmation step", async () => {
    const { user } = render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    const beginnerButton = screen.getByRole("button", { name: "beginner" })
    await user.click(beginnerButton)

    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    expect(screen.getByText("Booking Confirmation")).toBeInTheDocument()
  })

  it("should handle back navigation from select court to play level", async () => {
    const { user } = render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    const beginnerButton = screen.getByRole("button", { name: "beginner" })
    await user.click(beginnerButton)

    const backButton = screen.getByRole("button", { name: "Back" })
    await user.click(backButton)

    expect(screen.getByText("beginner")).toBeInTheDocument()
    expect(screen.getByText("intermediate")).toBeInTheDocument()
    expect(screen.getByText("advanced")).toBeInTheDocument()
  })

  it("should handle back navigation from confirmation to select court", async () => {
    const { user } = render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    const beginnerButton = screen.getByRole("button", { name: "beginner" })
    await user.click(beginnerButton)

    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    const backButton = screen.getByRole("button", { name: "Back" })
    await user.click(backButton)

    expect(screen.getByText("Select a Court")).toBeInTheDocument()
  })

  it("should handle booking confirmation", async () => {
    const mockOpenPopup = vi.fn()
    vi.spyOn(usePopupStateModule, "usePopupState").mockReturnValue({
      open: mockOpenPopup,
      isOpen: false,
      value: "",
      close: vi.fn(),
      toggle: vi.fn(),
      setValue: vi.fn(),
      clearValue: vi.fn(),
      navigation: {
        openPopup: vi.fn(),
        closePopup: vi.fn(),
        switchPopup: vi.fn(),
      },
    })

    const { user } = render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    const beginnerButton = screen.getByRole("button", { name: "beginner" })
    await user.click(beginnerButton)

    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    const confirmButton = screen.getByRole("button", { name: "Confirm Booking" })
    await user.click(confirmButton)

    expect(mockOpenPopup).toHaveBeenCalledWith()
  })

  it("should render booking confirmation with correct data", async () => {
    const { user } = render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })

    const beginnerButton = screen.getByRole("button", { name: "beginner" })
    await user.click(beginnerButton)

    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    expect(screen.getByText("Booking Confirmation")).toBeInTheDocument()
  })

  it("should handle casual user role correctly", () => {
    const casualAuth = {
      ...mockAuth,
      user: {
        ...mockAuth.user,
        role: MembershipType.casual,
      },
    }

    render(<BookFlow auth={casualAuth} />, { wrapper: withNuqsTestingAdapter() })

    expect(screen.getByText("beginner")).toBeInTheDocument()
  })

  it("should handle admin user role correctly", () => {
    const adminAuth = {
      ...mockAuth,
      user: {
        ...mockAuth.user,
        role: MembershipType.admin,
      },
    }

    render(<BookFlow auth={adminAuth} />, { wrapper: withNuqsTestingAdapter() })

    expect(screen.getByText("beginner")).toBeInTheDocument()
  })
})
