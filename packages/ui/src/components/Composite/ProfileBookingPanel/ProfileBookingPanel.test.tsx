import { adminUserMock, bookingsMock, casualUserMock, memberUserMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import { ProfileBookingPanel } from "./ProfileBookingPanel"

describe("<ProfileBookingPanel />", () => {
  it("renders all bookings", () => {
    render(<ProfileBookingPanel bookings={bookingsMock} user={adminUserMock} />)
    expect(screen.getAllByTestId("booking-card")).toHaveLength(bookingsMock.length)
  })

  it("disables delete and shows tooltip for casual user", async () => {
    const { user } = render(<ProfileBookingPanel bookings={bookingsMock} user={casualUserMock} />)
    const menuButtons = screen.getAllByRole("button", { name: /more options/i })
    user?.click(menuButtons[0])
    const deleteItem = await screen.findByText("Delete")
    expect(deleteItem).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByText("Please contact an admin to delete your booking")).toBeInTheDocument()
  })

  it("disables delete and shows tooltip for member user", async () => {
    const { user } = render(<ProfileBookingPanel bookings={bookingsMock} user={memberUserMock} />)
    const menuButtons = screen.getAllByRole("button", { name: /more options/i })
    user?.click(menuButtons[0])
    const deleteItem = await screen.findByText("Delete")
    expect(deleteItem).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByText("Please contact an admin to delete your booking")).toBeInTheDocument()
  })

  it("enables delete and does not show tooltip for admin user", async () => {
    const { user } = render(<ProfileBookingPanel bookings={bookingsMock} user={adminUserMock} />)
    const menuButtons = screen.getAllByRole("button", { name: /more options/i })
    user?.click(menuButtons[0])
    const deleteItem = await screen.findByText("Delete")
    expect(deleteItem).not.toHaveAttribute("aria-disabled", "true")
    expect(
      screen.queryByText("Please contact an admin to delete your booking"),
    ).not.toBeInTheDocument()
  })

  it("calls onDeleteBooking when admin clicks delete", async () => {
    const mockDeleteHandler = vi.fn().mockResolvedValue(undefined)
    const { user } = render(
      <ProfileBookingPanel
        bookings={bookingsMock}
        onDeleteBooking={mockDeleteHandler}
        user={adminUserMock}
      />,
    )
    const menuButtons = screen.getAllByRole("button", { name: /more options/i })
    user?.click(menuButtons[0])
    const deleteItem = await screen.findByText("Delete")
    await user?.click(deleteItem)
    expect(mockDeleteHandler).toHaveBeenCalledWith(bookingsMock[0].id)
  })

  it("renders empty state when no bookings", () => {
    render(<ProfileBookingPanel bookings={[]} user={adminUserMock} />)
    expect(screen.getByText("No bookings found")).toBeInTheDocument()
  })

  it("renders error state when error is true", () => {
    render(<ProfileBookingPanel bookings={[]} error user={adminUserMock} />)
    expect(screen.getByText("Failed to load bookings")).toBeInTheDocument()
  })
})
