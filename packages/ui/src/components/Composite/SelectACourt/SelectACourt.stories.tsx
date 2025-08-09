import { MembershipType } from "@repo/shared/enums"
import type { Meta, StoryObj } from "@storybook/react"
import { SelectACourt } from "./SelectACourt"

const meta: Meta<typeof SelectACourt> = {
  title: "Composite Components / SelectACourt",
  component: SelectACourt,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSelect: { action: "sessions selected" },
    onBack: { action: "back clicked" },
    onNext: { action: "next clicked" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const MemberUser: Story = {
  args: {
    user: {
      role: MembershipType.MEMBER,
      remainingSessions: 2,
    },
    title: "Select Your Sessions",
    sessions: [
      {
        date: "Monday, 12th May",
        attendees: 32,
        casualAttendees: 4,
        id: "monday-session",
        name: "ABA",
        location: "ABA Location",
        startTime: "17:00",
        endTime: "19:00",
        capacity: 35,
        casualCapacity: 5,
      },
      {
        date: "Wednesday, 14th May",
        attendees: 28,
        casualAttendees: 2,
        id: "wednesday-session",
        name: "UoA Rec",
        location: "UoA Rec Location",
        startTime: "19:30",
        endTime: "21:30",
        capacity: 30,
        casualCapacity: 5,
      },
      {
        date: "Thursday, 15th May",
        attendees: 25,
        casualAttendees: 3,
        id: "thursday-session",
        name: "Kings School",
        location: "Kings School Location",
        startTime: "19:30",
        endTime: "22:00",
        capacity: 30,
        casualCapacity: 5,
      },
      {
        date: "Friday, 16th May",
        attendees: 30,
        casualAttendees: 1,
        id: "friday-session",
        name: "UoA Rec Centre",
        location: "UoA Rec Centre Location",
        startTime: "19:30",
        endTime: "21:30",
        capacity: 35,
        casualCapacity: 5,
      },
      {
        date: "Saturday, 17th May",
        attendees: 20,
        casualAttendees: 2,
        id: "saturday-session",
        name: "ABA",
        location: "ABA Location",
        startTime: "16:00",
        endTime: "18:00",
        capacity: 25,
        casualCapacity: 3,
      },
    ],
    onSelect: (value) => console.log("Selected sessions:", value),
    onBack: () => console.log("Back button clicked"),
    onNext: (data) => console.log("Next button clicked with data:", data),
  },
}

export const CasualUser: Story = {
  args: {
    user: {
      role: MembershipType.CASUAL,
      remainingSessions: 2,
    },
    title: "Choose Your Session",
    sessions: [
      {
        date: "Monday, 12th May",
        attendees: 32,
        casualAttendees: 4,
        id: "monday-casual",
        name: "ABA",
        location: "UoA Rec",
        startTime: "17:00",
        endTime: "19:00",
        capacity: 35,
        casualCapacity: 5,
      },
      {
        date: "Wednesday, 14th May",
        attendees: 28,
        casualAttendees: 2,
        id: "wednesday-casual",
        name: "UoA Rec",
        location: "UoA Rec Location",
        startTime: "19:30",
        endTime: "21:30",
        capacity: 30,
        casualCapacity: 5,
      },
      {
        date: "Thursday, 15th May",
        attendees: 25,
        casualAttendees: 3,
        id: "thursday-casual",
        name: "Kings School",
        location: "Kings School Location",
        startTime: "19:30",
        endTime: "22:00",
        capacity: 30,
        casualCapacity: 5,
      },
      {
        date: "Friday, 16th May",
        attendees: 30,
        casualAttendees: 1,
        id: "friday-casual",
        name: "UoA Rec Centre",
        location: "UoA Rec Centre Location",
        startTime: "19:30",
        endTime: "21:30",
        capacity: 35,
        casualCapacity: 5,
      },
      {
        date: "Saturday, 17th May",
        attendees: 20,
        casualAttendees: 2,
        id: "saturday-casual",
        name: "ABA",
        location: "ABA Location",
        startTime: "16:00",
        endTime: "18:00",
        capacity: 25,
        casualCapacity: 3,
      },
    ],
    onSelect: (value) => console.log("Selected session:", value),
    onBack: () => console.log("Back button clicked"),
    onNext: (data) => console.log("Next button clicked with data:", data),
  },
}
