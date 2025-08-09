import { MembershipType } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { BookingConfirmation } from "./BookingConfirmation"

const defaultProps = {
  bookingData: [
    {
      date: "Tuesday 24/06/25",
      name: "UoA Rec Centre",
      location: "17 Symonds Street",
      startTime: "19:30",
      endTime: "22:00",
      capacity: 40,
      casualCapacity: 5,
      attendees: 39,
      casualAttendees: 0,
    },
  ],
  user: {
    role: MembershipType.member,
    remainingSessions: 6,
  },
  onBack: vi.fn(),
  onConfirm: vi.fn(),
}

describe("<BookingConfirmation />", () => {
  it("should render booking confirmation details", () => {
    render(<BookingConfirmation {...defaultProps} />)

    expect(screen.getByText("Booking Confirmation")).toBeInTheDocument()
    expect(screen.getByText("UoA Rec Centre")).toBeInTheDocument()
    expect(screen.getByText("19:30 - 22:00")).toBeInTheDocument()
    expect(screen.getByText("17 Symonds Street")).toBeInTheDocument()
    expect(screen.getByText("39 / 40")).toBeInTheDocument()
    expect(screen.getByText("1 / 2 this week • 5 total remaining")).toBeInTheDocument()
    expect(screen.getByText("Confirm Booking")).toBeInTheDocument()
  })

  it("should call onBack when back button is clicked", () => {
    const onBack = vi.fn()
    render(<BookingConfirmation {...defaultProps} onBack={onBack} />)

    screen.getByLabelText("Back").click()
    expect(onBack).toHaveBeenCalled()
  })

  it("should call onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn()
    render(<BookingConfirmation {...defaultProps} onConfirm={onConfirm} />)

    screen.getByText("Confirm Booking").click()
    expect(onConfirm).toHaveBeenCalled()
  })

  it("should display custom title when provided", () => {
    render(<BookingConfirmation {...defaultProps} title="Custom Title" />)

    expect(screen.getByText("Custom Title")).toBeInTheDocument()
  })
})
