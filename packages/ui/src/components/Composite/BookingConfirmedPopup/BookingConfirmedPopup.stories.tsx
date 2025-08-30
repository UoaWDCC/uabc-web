import { MembershipType, Popup } from "@repo/shared"
import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { BookingConfirmedPopup } from "./BookingConfirmedPopup"

const meta: Meta<typeof BookingConfirmedPopup> = {
  component: BookingConfirmedPopup,
  title: "Composite Components / BookingConfirmedPopup",
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  parameters: {
    query: {
      [Popup.BOOKING_CONFIRMED]: "open",
    },
  },
  args: {
    title: "Booking Confirmed!",
    message: "Email confirmation has been sent to xxxx@gmail.com",
    additionalMessage:
      "Please bank transfer to XXXXXXXXXXXX with your full name as reference. You will not be able to play on the day without bank transferring.",
  },
}

export default meta

type Story = StoryObj<typeof BookingConfirmedPopup>

export const Default: Story = {}

export const Casual: Story = {
  parameters: {
    query: {
      "booking-confirmed-popup-value": MembershipType.casual,
    },
  },
}
