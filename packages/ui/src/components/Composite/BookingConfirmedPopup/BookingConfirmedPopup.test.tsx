import { MembershipType, Popup } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { BookingConfirmedPopup } from "./BookingConfirmedPopup"

const defaultProps = {
  title: "Booking Confirmed!",
  message: "Email confirmation has been sent to xxxx@gmail.com",
  additionalMessage:
    "Please bank transfer to XXXXXXXXXXXX with your full name as reference. You will not be able to play on the day without bank transferring.",
}

describe("<BookingConfirmedPopup />", () => {
  it("should render and be closed by default if search param is not set", () => {
    render(<BookingConfirmedPopup {...defaultProps} />, { wrapper: withNuqsTestingAdapter() })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should open when the search param is set", async () => {
    render(<BookingConfirmedPopup {...defaultProps} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [Popup.BOOKING_CONFIRMED]: "open",
        },
      }),
    })
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Booking Confirmed!")).toBeInTheDocument()
    expect(
      screen.getByText("Email confirmation has been sent to xxxx@gmail.com"),
    ).toBeInTheDocument()
  })

  it("should show bank transfer details for casual members", async () => {
    render(<BookingConfirmedPopup {...defaultProps} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [Popup.BOOKING_CONFIRMED]: "open",
          [`${Popup.BOOKING_CONFIRMED}-value`]: MembershipType.casual,
        },
      }),
    })
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Booking Confirmed!")).toBeInTheDocument()
    expect(
      screen.getByText("Email confirmation has been sent to xxxx@gmail.com"),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Please bank transfer to XXXXXXXXXXXX with your full name as reference. You will not be able to play on the day without bank transferring.",
      ),
    ).toBeInTheDocument()
  })
})
