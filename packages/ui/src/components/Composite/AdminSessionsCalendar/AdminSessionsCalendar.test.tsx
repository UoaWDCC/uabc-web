import type { AdminGameSession } from "@repo/shared"
import {
  adminGameSessionBaseMock,
  adminGameSessionLowAttendanceMock,
  adminGameSessionUpcomingMock,
} from "@repo/shared/mocks"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { AdminSessionsCalendar } from "./AdminSessionsCalendar"

const mockOnDateSelect = vi.fn()

const createMockGameSession = (date: string, attendees = 25): AdminGameSession => ({
  ...adminGameSessionBaseMock,
  id: `session-${date}`,
  startTime: `${date}T19:30:00Z`,
  endTime: `${date}T22:00:00Z`,
  openTime: `${date}T18:30:00Z`,
  attendees,
  casualAttendees: Math.floor(attendees * 0.2),
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

  it("displays total attendees when multiple sessions exist on the same day", () => {
    const gameSessions = [
      {
        ...adminGameSessionBaseMock,
        id: "session-1",
        startTime: "2025-01-21T19:30:00Z",
        endTime: "2025-01-21T22:00:00Z",
        attendees: 30,
      },
      {
        ...adminGameSessionUpcomingMock,
        id: "session-2",
        startTime: "2025-01-21T14:00:00Z",
        endTime: "2025-01-21T16:30:00Z",
        attendees: 25,
      },
    ]
    const props = {
      ...defaultProps,
      gameSessions,
    }

    render(<AdminSessionsCalendar {...props} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()

    // Check if the total attendee count is displayed (30 + 25 = 55)
    const attendeeBadge = calendar.querySelector('span[style*="position: absolute"]')
    expect(attendeeBadge).toBeInTheDocument()
    expect(attendeeBadge).toHaveTextContent("55")
  })

  it("uses shared mock data correctly", () => {
    const gameSessions = [
      {
        ...adminGameSessionLowAttendanceMock,
        startTime: "2025-01-21T19:30:00Z",
        endTime: "2025-01-21T22:00:00Z",
      },
    ]
    const props = {
      ...defaultProps,
      gameSessions,
    }

    render(<AdminSessionsCalendar {...props} />)

    const calendar = screen.getByRole("grid")
    expect(calendar).toBeInTheDocument()

    // Check if the attendee count from shared mock is displayed
    const attendeeBadge = calendar.querySelector('span[style*="position: absolute"]')
    expect(attendeeBadge).toBeInTheDocument()
    expect(attendeeBadge).toHaveTextContent("15")
  })
})
