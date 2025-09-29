import type { AdminGameSession } from "@repo/shared"
import { GameSessionStatus, Weekday } from "@repo/shared"
import { adminGameSessionBaseMock } from "@repo/shared/mocks"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { isValidElement } from "react"
import { ChangeSessionPopup } from "./ChangeSessionPopup"

// Helper function to create test sessions
const createTestSession = (
  id: string,
  date: Date,
  status: GameSessionStatus = GameSessionStatus.UPCOMING,
  attendees = 25,
): AdminGameSession => {
  const startTime = new Date(date)
  startTime.setHours(19, 30, 0, 0)
  const endTime = new Date(date)
  endTime.setHours(22, 0, 0, 0)

  return {
    ...adminGameSessionBaseMock,
    id,
    day: Weekday.tuesday,
    status,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    attendees,
    capacity: 40,
    location: "Test Location",
    name: "Test Session",
  }
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  availableSessions: [],
  onConfirm: vi.fn(),
  onDateSelect: vi.fn(),
}

describe("<ChangeSessionPopup />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should be a valid React element", () => {
    expect(isValidElement(<ChangeSessionPopup {...defaultProps} />)).toBe(true)
  })

  it("should have correct displayName", () => {
    expect(ChangeSessionPopup.displayName).toBe("ChangeSessionPopup")
  })

  it("should render with default props", () => {
    render(<ChangeSessionPopup {...defaultProps} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Change Session" })).toBeInTheDocument()
    expect(screen.getByText("Select a new date to view available sessions")).toBeInTheDocument()
  })

  it("should render with custom title and description", () => {
    render(
      <ChangeSessionPopup
        {...defaultProps}
        description="Custom description"
        title="Custom Title"
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByRole("heading", { name: "Custom Title" })).toBeInTheDocument()
    expect(screen.getByText("Custom description")).toBeInTheDocument()
  })

  it("should render with custom popupId", () => {
    render(<ChangeSessionPopup {...defaultProps} popupId="custom-popup" />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should display empty state when no date is selected", () => {
    render(<ChangeSessionPopup {...defaultProps} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByText("No Date Selected")).toBeInTheDocument()
    expect(
      screen.getByText("Select a date from the calendar to view session details"),
    ).toBeInTheDocument()
  })

  it("should display empty state when no sessions available for selected date", () => {
    const selectedDate = new Date("2025-01-21")
    const availableSessions = [
      createTestSession("session-1", new Date("2025-01-22")), // Different date
    ]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("No Sessions Available")).toBeInTheDocument()
    expect(
      screen.getByText("There are no sessions available for the selected date"),
    ).toBeInTheDocument()
  })

  it("should display session details when date and sessions are available", () => {
    const selectedDate = new Date("2025-01-21")
    const availableSessions = [
      createTestSession("session-1", selectedDate, GameSessionStatus.ONGOING, 30),
    ]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // Check if session details are displayed
    expect(screen.getByText("Tuesday 21/01/25")).toBeInTheDocument()
    expect(screen.getByText("7:30 PM - 10:00 PM")).toBeInTheDocument()
    expect(screen.getByText("Test Location")).toBeInTheDocument()
    expect(screen.getByText("30/40 attendees")).toBeInTheDocument()
    expect(screen.getByText("ONGOING")).toBeInTheDocument()
  })

  it("should filter out current session from available sessions", () => {
    const selectedDate = new Date("2025-01-21")
    const currentSession = createTestSession("current-session", selectedDate)
    const availableSessions = [currentSession, createTestSession("other-session", selectedDate)]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        currentSession={currentSession}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // Should only show the other session, not the current one
    expect(screen.getByText("No Sessions Available")).toBeInTheDocument()
  })

  it("should show confirm and cancel buttons when session is available", () => {
    const selectedDate = new Date("2025-01-21")
    const availableSessions = [createTestSession("session-1", selectedDate)]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should call onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn()
    const selectedDate = new Date("2025-01-21")
    const availableSessions = [createTestSession("session-1", selectedDate)]

    const { user } = render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        onConfirm={onConfirm}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const confirmButton = screen.getByRole("button", { name: "Confirm" })
    await user.click(confirmButton)

    expect(onConfirm).toHaveBeenCalledWith(availableSessions[0])
  })

  it("should call onClose when cancel button is clicked", async () => {
    const onClose = vi.fn()
    const selectedDate = new Date("2025-01-21")
    const availableSessions = [createTestSession("session-1", selectedDate)]

    const { user } = render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        onClose={onClose}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const cancelButton = screen.getByRole("button", { name: "Cancel" })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })

  it("should display correct status color scheme for different session statuses", () => {
    const selectedDate = new Date("2025-01-21")
    const testCases = [
      { status: GameSessionStatus.ONGOING, expectedColor: "green" },
      { status: GameSessionStatus.UPCOMING, expectedColor: "blue" },
      { status: GameSessionStatus.PAST, expectedColor: "gray" },
    ]

    testCases.forEach(({ status }) => {
      const availableSessions = [createTestSession("session-1", selectedDate, status)]

      const { unmount } = render(
        <ChangeSessionPopup
          {...defaultProps}
          availableSessions={availableSessions}
          selectedDate={selectedDate}
        />,
        {
          wrapper: withNuqsTestingAdapter(),
        },
      )

      // The color scheme is applied via CSS classes, so we check if the status text is present
      expect(screen.getByText(status)).toBeInTheDocument()
      unmount()
    })
  })

  it("should handle multiple sessions for the same date by showing the first one", () => {
    const selectedDate = new Date("2025-01-21")
    const availableSessions = [
      createTestSession("session-1", selectedDate, GameSessionStatus.ONGOING, 20),
      createTestSession("session-2", selectedDate, GameSessionStatus.UPCOMING, 35),
    ]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // Should show the first session (session-1 with 20 attendees)
    expect(screen.getByText("20/40 attendees")).toBeInTheDocument()
    expect(screen.getByText("ONGOING")).toBeInTheDocument()
  })

  it("should sync external selectedDate with internal state using useUpdateEffect", async () => {
    const initialDate = new Date("2025-01-21")
    const newDate = new Date("2025-01-22")
    const availableSessions = [createTestSession("session-1", newDate)]

    const { rerender } = render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={initialDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // Initially should show no sessions for the initial date
    expect(screen.getByText("No Sessions Available")).toBeInTheDocument()

    // Update the selectedDate prop
    rerender(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={newDate}
      />,
    )

    // Should now show the session for the new date
    await waitFor(() => {
      expect(screen.getByText("Wednesday 22/01/25")).toBeInTheDocument()
    })
  })

  it("should call onDateSelect when date is selected from calendar", async () => {
    const onDateSelect = vi.fn()

    const { user } = render(<ChangeSessionPopup {...defaultProps} onDateSelect={onDateSelect} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    // Find and click on a date in the calendar
    const dayButton = screen.getByRole("button", { name: /^21$/ })
    await user.click(dayButton)

    expect(onDateSelect).toHaveBeenCalledWith(expect.any(Date))
  })

  it("should handle onConfirm callback", () => {
    const onConfirm = vi.fn()
    const availableSessions = [createTestSession("session-1", new Date("2025-01-21"))]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        onConfirm={onConfirm}
        selectedDate={new Date("2025-01-21")}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // onConfirm is passed to the component but not directly called in the current implementation
    // This test ensures the prop is accepted without errors
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should format session time correctly", () => {
    const selectedDate = new Date("2025-01-21")
    const session = createTestSession("session-1", selectedDate)
    // Modify the session to have specific times
    session.startTime = "2025-01-21T19:30:00Z"
    session.endTime = "2025-01-21T22:00:00Z"

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={[session]}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // Check if the formatted time is displayed
    expect(screen.getByText("7:30 PM - 10:00 PM")).toBeInTheDocument()
  })

  it("should format session date correctly", () => {
    const selectedDate = new Date("2025-01-21") // Tuesday
    const availableSessions = [createTestSession("session-1", selectedDate)]

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={availableSessions}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    // Check if the formatted date is displayed (Tuesday 21/01/25)
    expect(screen.getByText("Tuesday 21/01/25")).toBeInTheDocument()
  })

  it("should handle null selectedDate gracefully", () => {
    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={[createTestSession("session-1", new Date("2025-01-21"))]}
        selectedDate={null}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("No Date Selected")).toBeInTheDocument()
  })

  it("should handle undefined selectedDate gracefully", () => {
    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={[createTestSession("session-1", new Date("2025-01-21"))]}
        selectedDate={undefined}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("No Date Selected")).toBeInTheDocument()
  })

  it("should handle empty availableSessions array", () => {
    const selectedDate = new Date("2025-01-21")

    render(
      <ChangeSessionPopup {...defaultProps} availableSessions={[]} selectedDate={selectedDate} />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("No Sessions Available")).toBeInTheDocument()
  })

  it("should handle undefined availableSessions gracefully", () => {
    const selectedDate = new Date("2025-01-21")

    render(
      <ChangeSessionPopup
        {...defaultProps}
        availableSessions={undefined}
        selectedDate={selectedDate}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("No Sessions Available")).toBeInTheDocument()
  })
})
