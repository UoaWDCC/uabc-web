import { render, screen } from "@repo/ui/test-utils"
import { BookingTimesCard } from "./BookingTimesCard"

const baseProps = {
  title: "Tuesday, 12th May",
  bookingTime: "7:30 - 10pm",
  location: "UoA Hiwa Center",
}

describe("<BookingTimesCard />", () => {
  it("should render the title, booking time, and location", () => {
    render(<BookingTimesCard {...baseProps} type="default" />)
    expect(screen.getByText(baseProps.title)).toBeInTheDocument()
    expect(screen.getByText(baseProps.bookingTime)).toBeInTheDocument()
    expect(screen.getByText(baseProps.location)).toBeInTheDocument()
  })

  it.each([
    ["default", "Select", false],
    ["selected", "Unselect", false],
    ["full", "Full", true],
  ] as const)(
    "should render correct button label and disabled state for type=%s",
    (type, label, disabled) => {
      render(<BookingTimesCard {...baseProps} type={type} />)
      const button = screen.getByRole("button", { name: label })
      expect(button).toBeInTheDocument()
      if (disabled) {
        expect(button).toBeDisabled()
      } else {
        expect(button).not.toBeDisabled()
      }
    },
  )

  it("should default to type=default if type is not provided", () => {
    render(<BookingTimesCard {...baseProps} />)
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument()
  })
})
