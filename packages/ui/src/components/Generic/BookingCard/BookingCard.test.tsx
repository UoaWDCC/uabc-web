import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { BookingCard } from "./BookingCard"
import * as BookingCardModule from "./index"

const defaultProps = {
  day: "Saturday",
  location: "Auckland Badminton Stadium",
  address: "99 Gillies Ave",
  startTime: "7:30 PM",
  endTime: "10:00 PM",
  imageProps: {
    src: "https://placehold.co/100x100",
    alt: "Badminton court",
    width: 300,
    height: 200,
  },
  menuItems: [
    { label: "Edit", onClick: vi.fn(), color: "primary" },
    { label: "Delete", onClick: vi.fn(), color: "danger" },
  ],
}

describe("<BookingCard />", () => {
  it("should re-export the BookingCard component and check if BookingCard exists", () => {
    expect(BookingCardModule.BookingCard).toBeDefined()
    expect(isValidElement(<BookingCardModule.BookingCard {...defaultProps} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(BookingCard.displayName).toBe("BookingCard")
  })

  it("should render all main props correctly", () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByRole("heading", { level: 3, name: defaultProps.day })).toBeInTheDocument()
    expect(
      screen.getByText(`${defaultProps.location} - ${defaultProps.address}`),
    ).toBeInTheDocument()
    expect(
      screen.getByText(`${defaultProps.startTime} - ${defaultProps.endTime}`),
    ).toBeInTheDocument()
    expect(screen.getByAltText(defaultProps.imageProps.alt)).toBeInTheDocument()
    expect(screen.getByText("Edit")).toBeInTheDocument()
    expect(screen.getByText("Delete")).toBeInTheDocument()
  })

  it("should call menu item onClick when clicked", async () => {
    const { user } = render(<BookingCard {...defaultProps} />)
    const menuButton = screen.getByRole("button", { name: /edit/i })
    user.click(menuButton)
    const editItem = await screen.findByText("Edit")
    await user.click(editItem)
    expect(defaultProps.menuItems[0].onClick).toHaveBeenCalled()
    const deleteItem = await screen.findByText("Delete")
    await user.click(deleteItem)
    expect(defaultProps.menuItems[1].onClick).toHaveBeenCalled()
  })
})
