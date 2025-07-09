import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { BookingTimesCardGroup } from "./BookingTimesCardGroup"

describe("<BookingTimesCardGroup />", () => {
  const items = [
    {
      label: "Tuesday, 12th May",
      value: "booking-123",
      addon: "UoA Hiwa Center",
      description: "7:30 - 10pm",
      "data-testid": "test-id-1",
    },
    {
      label: "Wednesday, 13th May",
      value: "booking-456",
      addon: "UoA Hiwa Center",
      description: "2:00 - 4:30pm",
      disabled: true,
      "data-testid": "test-id-2",
    },
  ]

  it("should have correct displayName", () => {
    expect(BookingTimesCardGroup.displayName).toBe("BookingTimesCardGroup")
  })

  it("renders a FormControl and CheckboxCardGroup", () => {
    render(<BookingTimesCardGroup items={items} name="bookingTimes" />)
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getByTestId("test-id-1")).toBeInTheDocument()
    expect(screen.getByTestId("test-id-2")).toBeInTheDocument()
  })

  it("renders nothing if items is empty", () => {
    render(<BookingTimesCardGroup items={[]} name="bookingTimes" />)
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.queryAllByRole("checkbox").length).toBe(0)
  })
})
