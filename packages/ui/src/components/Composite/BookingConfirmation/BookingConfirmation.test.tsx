import { MembershipType } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { BookingConfirmation } from "./BookingConfirmation"

const defaultProps = {
  bookingData: [
    {
      date: "Tuesday 24/06/25",
      time: "7:30 PM - 10:00 PM",
      location: "UoA Rec Centre, 17 Symonds Street",
      attendees: "39/40",
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
    expect(screen.getByText("Tuesday 24/06/25")).toBeInTheDocument()
    expect(screen.getByText("7:30 PM - 10:00 PM")).toBeInTheDocument()
    expect(screen.getByText("UoA Rec Centre, 17 Symonds Street")).toBeInTheDocument()
    expect(screen.getByText("39/40 attendees")).toBeInTheDocument()
    expect(screen.getByText("Sessions Left: 1")).toBeInTheDocument()
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
