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
    },
    {
      label: "Wednesday, 13th May",
      value: "booking-456",
      addon: "UoA Hiwa Center",
      description: "2:00 - 4:30pm",
      disabled: true,
    },
  ]

  it("should have correct displayName", () => {
    expect(BookingTimesCardGroup.displayName).toBe("BookingTimesCardGroup")
  })

  it("renders a FormControl and CheckboxCardGroup", () => {
    render(<BookingTimesCardGroup items={items} />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("renders nothing if items is empty", () => {
    render(<BookingTimesCardGroup items={[]} />)
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.queryAllByRole("checkbox").length).toBe(0)
  })
})
