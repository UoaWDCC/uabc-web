import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import { BookingTimesCard } from "./BookingTimesCard"

const baseProps = {
  title: "Tuesday, 12th May",
  bookingTime: "7:30 - 10pm",
  location: "UoA Hiwa Center",
  onClick: vi.fn(),
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

  it("should call onClick when button is clicked", () => {
    const onClickMock = vi.fn()
    render(<BookingTimesCard {...baseProps} onClick={onClickMock} />)
    screen.getByRole("button", { name: "Select" }).click()
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it("should not call onClick when disabled button is clicked", () => {
    const onClickMock = vi.fn()
    render(<BookingTimesCard {...baseProps} onClick={onClickMock} type="full" />)
    screen.getByRole("button", { name: "Full" }).click()
    expect(onClickMock).not.toHaveBeenCalled()
  })
})
