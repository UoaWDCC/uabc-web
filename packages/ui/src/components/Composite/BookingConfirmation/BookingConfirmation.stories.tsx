import { MembershipType } from "@repo/shared"
import type { Meta, StoryObj } from "@storybook/react"
import { BookingConfirmation } from "./BookingConfirmation"

const meta: Meta<typeof BookingConfirmation> = {
  title: "Composite Components / BookingConfirmation",
  component: BookingConfirmation,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onBack: { action: "back clicked" },
    onConfirm: { action: "confirm clicked" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    bookingData: {
      date: "Tuesday 24/06/25",
      time: "7:30 PM - 10:00 PM",
      location: "UoA Rec Centre, 17 Symonds Street",
      attendees: "39/40",
      sessionsLeft: 6,
    },
    membershipType: MembershipType.member,
  },
}

export const CasualMember: Story = {
  args: {
    bookingData: {
      date: "Wednesday 25/06/25",
      time: "6:00 PM - 8:00 PM",
      location: "ABA, 123 Main Street",
      attendees: "15/20",
      sessionsLeft: 2,
    },
    membershipType: MembershipType.casual,
  },
}

export const CustomTitle: Story = {
  args: {
    bookingData: {
      date: "Thursday 26/06/25",
      time: "8:00 PM - 10:30 PM",
      location: "Kings School, 456 School Road",
      attendees: "25/30",
      sessionsLeft: 4,
    },
    membershipType: MembershipType.member,
    title: "Confirm Your Booking",
  },
}
