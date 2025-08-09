import { Weekday } from "@repo/shared"
import type { Meta, StoryObj } from "@storybook/react"
import { BookConfirm } from "./BookConfirm"

const meta: Meta<typeof BookConfirm> = {
  title: "Generic Components / BookConfirm",
  component: BookConfirm,
  argTypes: {
    bookings: {
      control: "object",
      description:
        "List of bookings with details like day, start time, end time, name, location, current attendees, and capacity.",
      table: {
        type: { summary: "Array<BookingDetailsProps>" },
      },
    },
    sessionCount: {
      control: "number",
      description: "Total number of sessions available for booking.",
      table: {
        type: { summary: "number" },
      },
    },
    casual: {
      control: "boolean",
      description: "Whether the booking is for a casual member.",
      table: {
        type: { summary: "boolean" },
      },
    },
  },
  args: {
    bookings: [
      {
        day: Weekday.TUESDAY,
        date: "24/06/25",
        startTime: "19:30",
        endTime: "20:00",
        name: "UoA Rec Centre",
        location: "17 Symonds Street",
        currentAttendees: 30,
        capacity: 40,
      },
    ],
    sessionCount: 10,
    onConfirm: () => {},
    casual: false,
  },
}
export default meta

type Story = StoryObj<typeof BookConfirm>

export const Default: Story = {}

export const CasualBooking: Story = {
  args: {
    casual: true,
  },
}

export const MultipleBookings: Story = {
  args: {
    bookings: [
      {
        day: Weekday.TUESDAY,
        date: "24/06/25",
        startTime: "19:30",
        endTime: "20:00",
        name: "UoA Rec Centre",
        location: "17 Symonds Street",
        currentAttendees: 30,
        capacity: 40,
      },
      {
        day: Weekday.TUESDAY,
        date: "24/06/25",
        startTime: "19:30",
        endTime: "20:00",
        name: "UoA Rec Centre",
        location: "17 Symonds Street",
        currentAttendees: 30,
        capacity: 40,
      },
    ],
  },
}
