import { GameSessionStatus } from "@repo/shared"
import { adminGameSessionBaseMock } from "@repo/shared/mocks"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AdminGameSessionCard } from "./AdminGameSessionCard"

describe("AdminGameSessionCard", () => {
  it("renders all required information", () => {
    render(<AdminGameSessionCard gameSession={adminGameSessionBaseMock} />)

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
        gameSession={{ ...adminGameSessionBaseMock, status: GameSessionStatus.UPCOMING }}
      />,
    )
    expect(screen.getByText("Upcoming")).toBeInTheDocument()

    rerender(
      <AdminGameSessionCard
        gameSession={{ ...adminGameSessionBaseMock, status: GameSessionStatus.PAST }}
      />,
    )
    expect(screen.getByText("Past")).toBeInTheDocument()
  })

  it("calls onExport when export button is clicked", async () => {
    const mockOnExport = vi.fn()
    const user = userEvent.setup()

    render(<AdminGameSessionCard gameSession={adminGameSessionBaseMock} onExport={mockOnExport} />)

    const exportButton = screen.getByRole("button", { name: /export member list as csv/i })
    await user.click(exportButton)

    expect(mockOnExport).toHaveBeenCalledTimes(1)
  })

  it("renders with correct attendance information", () => {
    render(
      <AdminGameSessionCard
        gameSession={{ ...adminGameSessionBaseMock, attendees: 15, capacity: 40 }}
      />,
    )
    expect(screen.getByText("15/40 attendees")).toBeInTheDocument()
  })

  it("renders with full capacity", () => {
    render(
      <AdminGameSessionCard
        gameSession={{ ...adminGameSessionBaseMock, attendees: 40, capacity: 40 }}
      />,
    )
    expect(screen.getByText("40/40 attendees")).toBeInTheDocument()
  })
})
