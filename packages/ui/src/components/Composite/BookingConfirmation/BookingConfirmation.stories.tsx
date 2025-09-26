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

type Story = StoryObj<typeof BookingConfirmation>

export const Default: Story = {
  args: {
    bookingData: [
      {
        date: "Tuesday 24/06/25",
        name: "UoA Rec Centre",
        location: "17 Symonds Street",
        startTime: "19:30",
        endTime: "22:00",
        capacity: 40,
        casualCapacity: 5,
        attendees: 39,
        casualAttendees: 0,
      },
    ],
    user: {
      role: MembershipType.member,
      remainingSessions: 2,
    },
  },
}

export const CasualMember: Story = {
  args: {
    bookingData: [
      {
        date: "Wednesday 25/06/25",
        name: "ABA",
        location: "ABA Location",
        startTime: "16:00",
        endTime: "18:00",
        capacity: 25,
        casualCapacity: 3,
        attendees: 15,
        casualAttendees: 0,
      },
    ],
    user: {
      role: MembershipType.casual,
      remainingSessions: 1,
    },
  },
}

export const CustomTitle: Story = {
  args: {
    bookingData: [
      {
        date: "Thursday 26/06/25",
        name: "Kings School",
        location: "Kings School Location",
        startTime: "19:30",
        endTime: "22:00",
        capacity: 30,
        casualCapacity: 5,
        attendees: 25,
        casualAttendees: 0,
      },
    ],
    user: {
      role: MembershipType.member,
      remainingSessions: 2,
    },
    title: "Confirm Your Booking",
  },
}
