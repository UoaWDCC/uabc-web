import { Weekday } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as BookConfirmModule from "./BookConfirm"
import { BookConfirm } from "./BookConfirm"

const mockBookings = {
  bookings: [
    {
      day: Weekday.TUESDAY,
      date: "24/06/25",
      startTime: "19:30",
      endTime: "20:00",
      name: "UoA Rec Centre",
      location: "17 Symonds Street",
      currentAttendees: 30,
      capacity: 40,
    },
    {
      day: Weekday.MONDAY,
      date: "23/06/25",
      startTime: "17:30",
      endTime: "18:00",
      name: "Kings College",
      location: "address",
      currentAttendees: 20,
      capacity: 25,
    },
  ],
}

const mockConfirm = vi.fn()

const mockProps = {
  ...mockBookings,
  sessionCount: 10,
  onConfirm: mockConfirm,
}

describe("<BookConfirm />", () => {
  it("should re-export the BookConfirm component, and check it exists", () => {
    expect(BookConfirmModule.BookConfirm).toBeDefined()
    expect(isValidElement(<BookConfirmModule.BookConfirm {...mockProps} />)).toBe(true)
  })

  it("should render the confirm button and number of sessions", () => {
    render(<BookConfirm {...mockProps} />)

    const confirmButton = screen.getByRole("button", { name: "Confirm Booking" })
    expect(confirmButton).toBeInTheDocument()

    const sessionCountText = screen.getByText("Sessions left after booking: 8")
    expect(sessionCountText).toBeInTheDocument()

    const weeklyLimitText = screen.getByText("You can book up to 2 sessions per week")
    expect(weeklyLimitText).toBeInTheDocument()
  })

  it("should render bank transfer message for casual bookings", () => {
    render(<BookConfirm {...mockProps} casual />)

    const bankTransferMessage = screen.getByText(
      "Please bank transfer to XXXXXXXXXXXX with your full name as reference. You will not be able to play on the day without bank transferring.",
    )
    expect(bankTransferMessage).toBeInTheDocument()

    expect(screen.queryByText("Sessions left after booking: 8")).not.toBeInTheDocument()
    expect(screen.queryByText("You can book up to 2 sessions per week")).not.toBeInTheDocument()
  })

  it("should render booking details for each booking", () => {
    render(<BookConfirm {...mockProps} />)

    mockBookings.bookings.forEach((booking) => {
      const dayText = screen.getByText(`${booking.day} ${booking.date}`)
      expect(dayText).toBeInTheDocument()

      const timeText = screen.getByText(`${booking.startTime} - ${booking.endTime}`)
      expect(timeText).toBeInTheDocument()

      const locationAndNameText = screen.getByText(`${booking.name}, ${booking.location}`)
      expect(locationAndNameText).toBeInTheDocument()

      const attendeesText = screen.getByText(
        `${booking.currentAttendees}/${booking.capacity} attendees`,
      )
      expect(attendeesText).toBeInTheDocument()
    })
  })

  it("should correctly display location and address if only one supplied", () => {
    const bookingWithoutName = {
      ...mockBookings.bookings[0],
      name: undefined,
    }
    const bookingWithoutLocation = {
      ...mockBookings.bookings[1],
      location: undefined,
    }

    render(
      <BookConfirm
        bookings={[bookingWithoutName, bookingWithoutLocation]}
        onConfirm={mockConfirm}
        sessionCount={10}
      />,
    )

    expect(screen.getByText("17 Symonds Street")).toBeInTheDocument()
    expect(screen.getByText("Kings College")).toBeInTheDocument()
  })
})
