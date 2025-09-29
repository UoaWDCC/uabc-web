import type { AdminGameSession } from "@repo/shared"
import { GameSessionStatus, Weekday } from "@repo/shared"
import { adminGameSessionBaseMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
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
    expect(screen.getByText(GameSessionStatus.ONGOING)).toBeInTheDocument()
  })
})
