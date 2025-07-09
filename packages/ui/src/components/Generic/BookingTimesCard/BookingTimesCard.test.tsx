import { render, screen } from "@repo/ui/test-utils"
import { BookingTimesCard } from "./BookingTimesCard"

describe("<BookingTimesCard />", () => {
  const defaultProps = {
    label: "Tuesday, 12th May",
    value: "booking-id-123",
    location: "UoA Hiwa Center",
    bookingTime: "7:30 - 10pm",
  }

  it("should have correct displayName", () => {
    expect(BookingTimesCard.displayName).toBe("BookingTimesCard")
  })

  it("should render the label correctly", () => {
    render(<BookingTimesCard {...defaultProps} />)

    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()
    expect(screen.getByText("Tuesday, 12th May")).toBeInTheDocument()
  })

  it("should render the props correctly", () => {
    render(<BookingTimesCard {...defaultProps} />)

    expect(screen.getByText("7:30 - 10pm")).toBeInTheDocument()
    expect(screen.getByText("UoA Hiwa Center")).toBeInTheDocument()
  })

  it("should not be disabled when full prop is not provided", () => {
    render(<BookingTimesCard {...defaultProps} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeDisabled()
  })

  it("should be disabled when full prop is true", () => {
    render(<BookingTimesCard {...defaultProps} full={true} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeDisabled()
  })

  it("should handle different prop values correctly", () => {
    const customProps = {
      label: "Monday, 10th June",
      value: "custom-booking-id",
      location: "Downtown Center",
      bookingTime: "1:00 - 3:30pm",
    }

    render(<BookingTimesCard {...customProps} />)

    expect(screen.getByText("Monday, 10th June")).toBeInTheDocument()
    expect(screen.getByText("Downtown Center")).toBeInTheDocument()
    expect(screen.getByText("1:00 - 3:30pm")).toBeInTheDocument()
  })

  it("should render Clock10Icon with the booking time", () => {
    render(<BookingTimesCard {...defaultProps} />)

    const timeSection = screen.getByText("7:30 - 10pm").parentElement
    expect(timeSection).toBeInTheDocument()
    // Since we can't directly test for the icon, we check the parent structure
    expect(timeSection?.childNodes.length).toBeGreaterThan(1)
  })

  it("should render MapPinIcon with the location", () => {
    render(<BookingTimesCard {...defaultProps} />)

    const locationSection = screen.getByText("UoA Hiwa Center").parentElement
    expect(locationSection).toBeInTheDocument()
    // Since we can't directly test for the icon, we check the parent structure
    expect(locationSection?.childNodes.length).toBeGreaterThan(1)
  })

  it("should pass additional props to the CheckboxCard component", () => {
    render(<BookingTimesCard {...defaultProps} data-testid="booking-card" />)

    expect(screen.getByTestId("booking-card")).toBeInTheDocument()
  })
})
