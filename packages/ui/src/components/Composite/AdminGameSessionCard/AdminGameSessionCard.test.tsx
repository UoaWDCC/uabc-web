import { GameSessionStatus } from "@repo/shared"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AdminGameSessionCard } from "./AdminGameSessionCard"

const defaultProps = {
  gameSession: {
    id: "session-123",
    day: "Tuesday",
    status: GameSessionStatus.ONGOING,
    startTime: "2025-01-21T19:30:00Z",
    endTime: "2025-01-21T22:00:00Z",
    name: "UoA Rec Centre",
    location: "17 Symonds Street",
    attendees: 39,
    capacity: 40,
    casualAttendees: 5,
    casualCapacity: 10,
    openTime: "2025-01-21T18:30:00Z",
    semester: "semester-123",
    updatedAt: "2025-01-21T00:00:00Z",
    createdAt: "2025-01-21T00:00:00Z",
  },
}

describe("AdminGameSessionCard", () => {
  it("renders all required information", () => {
    render(<AdminGameSessionCard {...defaultProps} />)

    expect(screen.getByText("Tuesday")).toBeInTheDocument()
    expect(screen.getByText("Ongoing")).toBeInTheDocument()
    expect(screen.getByText("7:30 PM - 10:00 PM")).toBeInTheDocument()
    expect(screen.getByText("UoA Rec Centre")).toBeInTheDocument()
    expect(screen.getByText("17 Symonds Street")).toBeInTheDocument()
    expect(screen.getByText("39/40 attendees")).toBeInTheDocument()
    expect(screen.getByText("Export Member List as CSV")).toBeInTheDocument()
  })

  it("displays correct status badge for different statuses", () => {
    const { rerender } = render(
      <AdminGameSessionCard
        {...defaultProps}
        gameSession={{ ...defaultProps.gameSession, status: GameSessionStatus.UPCOMING }}
      />,
    )
    expect(screen.getByText("Upcoming")).toBeInTheDocument()

    rerender(
      <AdminGameSessionCard
        {...defaultProps}
        gameSession={{ ...defaultProps.gameSession, status: GameSessionStatus.PAST }}
      />,
    )
    expect(screen.getByText("Past")).toBeInTheDocument()
  })

  it("calls onExport when export button is clicked", async () => {
    const mockOnExport = vi.fn()
    const user = userEvent.setup()

    render(<AdminGameSessionCard {...defaultProps} onExport={mockOnExport} />)

    const exportButton = screen.getByRole("button", { name: /export member list as csv/i })
    await user.click(exportButton)

    expect(mockOnExport).toHaveBeenCalledTimes(1)
  })

  it("renders with correct attendance information", () => {
    render(
      <AdminGameSessionCard
        {...defaultProps}
        gameSession={{ ...defaultProps.gameSession, attendees: 15, capacity: 40 }}
      />,
    )
    expect(screen.getByText("15/40 attendees")).toBeInTheDocument()
  })

  it("renders with full capacity", () => {
    render(
      <AdminGameSessionCard
        {...defaultProps}
        gameSession={{ ...defaultProps.gameSession, attendees: 40, capacity: 40 }}
      />,
    )
    expect(screen.getByText("40/40 attendees")).toBeInTheDocument()
  })
})
