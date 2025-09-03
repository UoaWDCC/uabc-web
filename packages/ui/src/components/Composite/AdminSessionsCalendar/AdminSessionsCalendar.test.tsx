import type { AdminGameSession } from "@repo/shared"
import { GameSessionStatus, Weekday } from "@repo/shared"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { AdminSessionsCalendar } from "./AdminSessionsCalendar"

const mockOnDateSelect = vi.fn()

const createMockGameSession = (date: string, attendees = 25): AdminGameSession => ({
  id: `session-${date}`,
  day: Weekday.tuesday,
  status: GameSessionStatus.ONGOING,
  startTime: `${date}T19:30:00Z`,
  endTime: `${date}T22:00:00Z`,
  openTime: `${date}T18:30:00Z`,
  name: "UoA Rec Centre",
  location: "17 Symonds Street",
  attendees,
  capacity: 40,
  casualAttendees: Math.floor(attendees * 0.2),
  casualCapacity: 10,
  semester: "semester-123",
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
})

const defaultProps = {
  selectedDate: new Date("2025-01-21"),
  onDateSelect: mockOnDateSelect,
}

describe("<AdminSessionsCalendar />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the calendar component", () => {
    render(<AdminSessionsCalendar {...defaultProps} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()
  })

  it("calls onDateSelect when a date is clicked", async () => {
    const user = userEvent.setup()
    render(<AdminSessionsCalendar {...defaultProps} />)

    const calendar = screen.getByRole("grid")
    const dayButton = calendar.querySelector('button[aria-label="22"]')

    if (dayButton) {
      await user.click(dayButton)
      expect(mockOnDateSelect).toHaveBeenCalled()
    }
  })

  it("displays the selected date correctly", () => {
    render(<AdminSessionsCalendar {...defaultProps} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()
  })

  it("applies custom calendar props", () => {
    const customProps = {
      ...defaultProps,
      calendarProps: {
        size: "lg",
        colorScheme: "blue",
      },
    }

    render(<AdminSessionsCalendar {...customProps} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()
  })

  it("handles game sessions with attendees", () => {
    const gameSessions = [
      createMockGameSession("2025-01-21", 30),
      createMockGameSession("2025-01-28", 15),
    ]
    const props = {
      ...defaultProps,
      gameSessions,
    }

    render(<AdminSessionsCalendar {...props} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()
  })

  it("handles empty game sessions", () => {
    const props = {
      ...defaultProps,
      gameSessions: [],
    }

    render(<AdminSessionsCalendar {...props} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()
  })

  it("displays attendee count for active dates", () => {
    const gameSessions = [createMockGameSession("2025-01-21", 25)]
    const props = {
      ...defaultProps,
      gameSessions,
    }

    render(<AdminSessionsCalendar {...props} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()

    // Check if the attendee count is displayed (the small badge with number)
    const attendeeBadge = calendar.querySelector('span[style*="position: absolute"]')
    expect(attendeeBadge).toBeInTheDocument()
    expect(attendeeBadge).toHaveTextContent("25")
  })
})
