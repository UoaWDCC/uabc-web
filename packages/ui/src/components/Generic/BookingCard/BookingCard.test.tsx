import { render, screen } from "@repo/ui/test-utils"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { isValidElement } from "react"
import { BookingCard } from "./BookingCard"
import * as BookingCardModule from "./index"

dayjs.extend(utc)
dayjs.extend(timezone)

const NZ_TIMEZONE = "Pacific/Auckland"

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

  it("should render all main props correctly", () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByRole("heading", { level: 3, name: defaultProps.day })).toBeInTheDocument()
    expect(
      screen.getByText(`${defaultProps.location} - ${defaultProps.address}`),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        `${dayjs(defaultProps.startTime).tz(NZ_TIMEZONE).format("h:mm A")} - ${dayjs(defaultProps.endTime).tz(NZ_TIMEZONE).format("h:mm A D MMM YYYY")}`,
      ),
    ).toBeInTheDocument()
    expect(screen.getByAltText(defaultProps.imageProps.alt)).toBeInTheDocument()
  })

  it("should call menu item onClick when clicked", async () => {
    const { user } = render(<BookingCard {...defaultProps} />)
    const menuButton = screen.getByRole("button", { name: /more options/i })
    user.click(menuButton)
    const editItem = await screen.findByText("Edit")
    await user.click(editItem)
    expect(defaultProps.menuItems[0].onClick).toHaveBeenCalled()
    await user.click(menuButton)
    const deleteItem = await screen.findByText("Delete")
    await user.click(deleteItem)
    expect(defaultProps.menuItems[1].onClick).toHaveBeenCalled()
  })

  it("should disable the Delete menu item when disabled is true", async () => {
    const menuItems = [
      { label: "Edit", onClick: vi.fn(), color: "primary" },
      { label: "Delete", onClick: vi.fn(), color: "danger", disabled: true },
    ]
    const { user } = render(<BookingCard {...defaultProps} menuItems={menuItems} />)
    const menuButton = screen.getByRole("button", { name: /more options/i })
    user.click(menuButton)
    const deleteItem = await screen.findByText("Delete")
    expect(deleteItem).toHaveAttribute("aria-disabled", "true")
  })
})
