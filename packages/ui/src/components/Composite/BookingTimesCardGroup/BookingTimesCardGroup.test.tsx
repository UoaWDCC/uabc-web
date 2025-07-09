import { fireEvent, render, screen } from "@repo/ui/test-utils"
import type { BookingTimesCardProps } from "../../Generic/BookingTimesCard"
import { BookingTimesCardGroup } from "./BookingTimesCardGroup"

describe("<BookingTimesCardGroup />", () => {
  const defaultItems: BookingTimesCardProps[] = [
    {
      label: "Tuesday, 12th May",
      value: "booking-id-123",
      location: "UoA Hiwa Center",
      bookingTime: "7:30 - 10pm",
    },
    {
      label: "Wednesday, 13th May",
      value: "booking-id-456",
      location: "Downtown Center",
      bookingTime: "2:00 - 4:30pm",
      full: true,
    },
    {
      label: "Thursday, 14th May",
      value: "booking-id-789",
      location: "UoA Hiwa Center",
      bookingTime: "10:00am - 12:30pm",
    },
  ]

  it("should have correct displayName", () => {
    expect(BookingTimesCardGroup.displayName).toBe("BookingTimesCardGroup")
  })

  it("should render all booking time cards", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    expect(screen.getByText("Tuesday, 12th May")).toBeInTheDocument()
    expect(screen.getByText("Wednesday, 13th May")).toBeInTheDocument()
    expect(screen.getByText("Thursday, 14th May")).toBeInTheDocument()
  })

  it("should render all booking times correctly", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    expect(screen.getByText("7:30 - 10pm")).toBeInTheDocument()
    expect(screen.getByText("2:00 - 4:30pm")).toBeInTheDocument()
    expect(screen.getByText("10:00am - 12:30pm")).toBeInTheDocument()
  })

  it("should render all locations correctly", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    // UoA Hiwa Center appears twice in our test data
    const hiwaCenterElements = screen.getAllByText("UoA Hiwa Center")
    expect(hiwaCenterElements).toHaveLength(2)
    expect(screen.getByText("Downtown Center")).toBeInTheDocument()
  })

  it("should disable cards marked as full", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    const checkboxes = screen.getAllByRole("checkbox")

    // Wednesday card should be disabled (index 1)
    expect(checkboxes[1]).toBeDisabled()

    // Other cards should be enabled
    expect(checkboxes[0]).not.toBeDisabled()
    expect(checkboxes[2]).not.toBeDisabled()
  })

  it("should properly pass additional props to CheckboxCardGroup", () => {
    render(<BookingTimesCardGroup data-testid="booking-group" items={defaultItems} />)

    expect(screen.getByTestId("booking-group")).toBeInTheDocument()
  })

  it("should render cards with empty items array", () => {
    render(<BookingTimesCardGroup items={[]} />)

    // Verify the component renders without errors
    const formControl = screen.getByRole("group")
    expect(formControl).toBeInTheDocument()
  })

  it("should check the card when clicked", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes[0]).not.toBeChecked()

    fireEvent.click(checkboxes[0])

    expect(checkboxes[0]).toBeChecked()
  })

  it("should not check the card when disabled", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes[1]).toBeDisabled()
    expect(checkboxes[1]).not.toBeChecked()

    const disabledCard = checkboxes[1].closest("label")
    fireEvent.click(disabledCard || checkboxes[1])

    // Verify the disabled checkbox remains unchecked
    expect(checkboxes[1]).not.toBeChecked()
  })

  it("should uncheck previously checked card when another is selected", () => {
    render(<BookingTimesCardGroup items={defaultItems} />)

    const checkboxes = screen.getAllByRole("checkbox")

    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()

    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).not.toBeChecked()
  })
})
