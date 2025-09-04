import { adminGameSessionBaseMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { AdminSessionsCalendar } from "./AdminSessionsCalendar"

const mockSessions = [
  {
    ...adminGameSessionBaseMock,
    id: "session-1",
    startTime: "2025-01-21T19:30:00Z",
    attendees: 20,
  },
  {
    ...adminGameSessionBaseMock,
    id: "session-2",
    startTime: "2025-01-21T14:00:00Z",
    attendees: 15,
  },
  {
    ...adminGameSessionBaseMock,
    id: "session-3",
    startTime: "2025-01-22T19:30:00Z",
    attendees: 30,
  },
]

describe("AdminSessionsCalendar", () => {
  const defaultProps = {
    selectedDate: new Date("2025-01-21"),
    onDateSelect: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render calendar with correct displayName", () => {
    expect(AdminSessionsCalendar.displayName).toBe("AdminSessionsCalendar")
  })

  it("should render calendar component", () => {
    render(<AdminSessionsCalendar {...defaultProps} />)

    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("should display selected date", () => {
    render(<AdminSessionsCalendar {...defaultProps} />)

    const selectedDateElement = screen.getByText("21")
    expect(selectedDateElement).toBeInTheDocument()
  })

  it("should call onDateSelect when a date is clicked", async () => {
    const mockOnDateSelect = vi.fn()

    const { user } = render(
      <AdminSessionsCalendar
        {...defaultProps}
        gameSessions={mockSessions}
        onDateSelect={mockOnDateSelect}
      />,
    )

    const dateButton = screen.getByText("21")
    await user.click(dateButton)

    expect(mockOnDateSelect).toHaveBeenCalledTimes(1)
  })

  it("should display attendee count tags for dates with sessions", () => {
    render(<AdminSessionsCalendar {...defaultProps} gameSessions={mockSessions} />)

    const attendeeTag = screen.getByText("35") // 20 + 15 for 2025-01-21
    expect(attendeeTag).toBeInTheDocument()
  })

  it("should display correct attendee count for single session", () => {
    render(
      <AdminSessionsCalendar
        {...defaultProps}
        gameSessions={[mockSessions[2]]} // Only session-3 on 2025-01-22
      />,
    )

    const attendeeTag = screen.getByText("30")
    expect(attendeeTag).toBeInTheDocument()
  })

  it("should disable dates without sessions", () => {
    render(<AdminSessionsCalendar {...defaultProps} gameSessions={mockSessions} />)

    // Find a date without sessions (e.g., 23rd)
    const inactiveDate = screen.getByText("23")
    const dateButton = inactiveDate.closest("button")

    expect(dateButton).toHaveAttribute("data-disabled", "")
  })

  it("should enable dates with sessions", () => {
    render(<AdminSessionsCalendar {...defaultProps} gameSessions={mockSessions} />)

    // Find a date with sessions (21st)
    const activeDate = screen.getByText("21")
    const dateButton = activeDate.closest("button")

    expect(dateButton).toHaveAttribute("data-disabled", "false")
  })

  it("should handle empty gameSessions array", () => {
    render(<AdminSessionsCalendar {...defaultProps} gameSessions={[]} />)

    expect(screen.getByRole("grid")).toBeInTheDocument()
    // All dates should be disabled when no sessions
    const dateButtons = screen.getAllByRole("button")
    dateButtons.forEach((button) => {
      if (button.textContent?.match(/^\d+$/)) {
        expect(button).toHaveAttribute("data-disabled", "")
      }
    })
  })

  it("should handle undefined gameSessions", () => {
    render(<AdminSessionsCalendar {...defaultProps} gameSessions={undefined} />)

    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("should pass through calendarProps to Calendar component", () => {
    const customCalendarProps = {
      borderWidth: "2px",
      rounded: "lg",
    }

    render(<AdminSessionsCalendar {...defaultProps} calendarProps={customCalendarProps} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()
  })

  it("should display today indicator", () => {
    const today = new Date()
    render(<AdminSessionsCalendar onDateSelect={defaultProps.onDateSelect} selectedDate={today} />)

    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("should handle multiple sessions on the same date correctly", () => {
    const sessionsSameDate = [
      {
        ...adminGameSessionBaseMock,
        id: "session-1",
        startTime: "2025-01-21T10:00:00Z",
        attendees: 10,
      },
      {
        ...adminGameSessionBaseMock,
        id: "session-2",
        startTime: "2025-01-21T15:00:00Z",
        attendees: 20,
      },
      {
        ...adminGameSessionBaseMock,
        id: "session-3",
        startTime: "2025-01-21T20:00:00Z",
        attendees: 30,
      },
    ]

    render(<AdminSessionsCalendar {...defaultProps} gameSessions={sessionsSameDate} />)

    // Should show total attendees (10 + 20 + 30 = 60)
    const attendeeTag = screen.getByText("60")
    expect(attendeeTag).toBeInTheDocument()
  })

  it("should maintain selected state for active dates", () => {
    render(<AdminSessionsCalendar {...defaultProps} gameSessions={mockSessions} />)

    const selectedDate = screen.getByText("21")
    const dateButton = selectedDate.closest("button")

    expect(dateButton).toHaveAttribute("data-selected", "")
  })

  it("should not show selected state for inactive dates even if selectedDate matches", () => {
    render(
      <AdminSessionsCalendar
        gameSessions={mockSessions} // Date without sessions
        onDateSelect={defaultProps.onDateSelect}
        selectedDate={new Date("2025-01-23")}
      />,
    )

    const date23 = screen.getByText("23")
    const dateButton = date23.closest("button")

    // Should be disabled and not selected
    expect(dateButton).toHaveAttribute("data-disabled", "")
    expect(dateButton).toHaveAttribute("data-selected", "false")
  })

  it("should handle rapid date selection changes", async () => {
    const mockOnDateSelect = vi.fn()

    const { user } = render(
      <AdminSessionsCalendar
        {...defaultProps}
        gameSessions={mockSessions}
        onDateSelect={mockOnDateSelect}
      />,
    )

    const date21 = screen.getByText("21")
    const date22 = screen.getByText("22")

    await user.click(date21)
    await user.click(date22)

    expect(mockOnDateSelect).toHaveBeenCalledTimes(2)
  })
})
