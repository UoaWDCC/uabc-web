import { formatDateWithOrdinal, mockSessions } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { vi } from "vitest"

const mockOpenPopup = vi.fn()
vi.mock("@repo/ui/hooks", async () => {
  const actual = await vi.importActual<typeof import("@repo/ui/hooks")>("@repo/ui/hooks")
  return {
    ...actual,
    usePopupState: vi.fn(() => ({
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
    })),
  }
})

import { MembershipType } from "@repo/shared"
import { memberUserMock } from "@repo/shared/mocks"
import * as Hooks from "@repo/ui/hooks"
import { BookFlow } from "./BookFlow"

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

describe("<BookFlow />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render BookACourt component on initial step", () => {
    render(<BookFlow auth={mockAuth} />, { wrapper: withNuqsTestingAdapter() })
    expect(screen.getByText(MembershipType.member)).toBeInTheDocument()
    expect(screen.getByText(MembershipType.casual)).toBeInTheDocument()
    expect(screen.getByText(MembershipType.admin)).toBeInTheDocument()
  })

  it("should show empty state when no bookings are available", () => {
    render(<BookFlow auth={mockAuth} sessions={[]} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(screen.getByText("No bookings found")).toBeInTheDocument()
    expect(screen.getByText("There are no bookings available at the moment.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go back to profile" })).toBeInTheDocument()
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
    const { user } = render(<BookFlow auth={mockAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    const beginnerButton = screen.getByRole("button", { name: /beginner/i })
    await user.click(beginnerButton)
    expect(screen.getByText(/select a court/i)).toBeInTheDocument()
  })

  it("should handle court selection and move to confirmation step", async () => {
    const { user } = render(<BookFlow auth={mockAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    const beginnerButton = screen.getByRole("button", { name: /beginner/i })
    await user.click(beginnerButton)
    const firstDateLabel = formatDateWithOrdinal(mockSessions[0].date)
    const dateText = screen.getByText(firstDateLabel)
    await user.click(dateText.closest("label") ?? dateText)
    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)
    expect(screen.getByText("Booking Confirmation")).toBeInTheDocument()
  })

  it("should handle back navigation from select court to play level", async () => {
    const { user } = render(<BookFlow auth={mockAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    const beginnerButton = screen.getByRole("button", { name: /beginner/i })
    await user.click(beginnerButton)
    const backButton = screen.getByRole("button", { name: "Back" })
    await user.click(backButton)
    expect(screen.getByText(/beginner/i)).toBeInTheDocument()
    expect(screen.getByText(/intermediate/i)).toBeInTheDocument()
    expect(screen.getByText(/advanced/i)).toBeInTheDocument()
  })

  it("should handle back navigation from confirmation to select court", async () => {
    const { user } = render(<BookFlow auth={mockAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    const beginnerButton = screen.getByRole("button", { name: /beginner/i })
    await user.click(beginnerButton)
    const firstDateLabel = formatDateWithOrdinal(mockSessions[0].date)
    const dateText = screen.getByText(firstDateLabel)
    await user.click(dateText.closest("label") ?? dateText)
    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)
    const backButton = screen.getByRole("button", { name: "Back" })
    await user.click(backButton)
    expect(screen.getByText(/select a court/i)).toBeInTheDocument()
  })

  it("should handle booking confirmation", async () => {
    const openSpy = vi.fn()
    ;(Hooks.usePopupState as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      open: openSpy,
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
    const { user } = render(<BookFlow auth={mockAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    const beginnerButton = screen.getByRole("button", { name: /beginner/i })
    await user.click(beginnerButton)
    const firstDateLabel = formatDateWithOrdinal(mockSessions[0].date)
    const dateText = screen.getByText(firstDateLabel)
    await user.click(dateText.closest("label") ?? dateText)
    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)
    const confirmButton = screen.getByRole("button", { name: "Confirm Booking" })
    await user.click(confirmButton)
    expect(openSpy).toHaveBeenCalled()
  })

  it("should render booking confirmation with correct data", async () => {
    const { user } = render(<BookFlow auth={mockAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    const beginnerButton = screen.getByRole("button", { name: /beginner/i })
    await user.click(beginnerButton)
    const firstDateLabel = formatDateWithOrdinal(mockSessions[0].date)
    await user.click(screen.getByText(firstDateLabel))
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
    render(<BookFlow auth={casualAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(screen.getByText(/beginner/i)).toBeInTheDocument()
  })

  it("should handle admin user role correctly", () => {
    const adminAuth = {
      ...mockAuth,
      user: {
        ...mockAuth.user,
        role: MembershipType.admin,
      },
    }
    render(<BookFlow auth={adminAuth} sessions={mockSessions} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(screen.getByText(/beginner/i)).toBeInTheDocument()
  })
})
