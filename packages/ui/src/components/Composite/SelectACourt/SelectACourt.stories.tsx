import { MembershipType } from "@repo/shared/types/enums"
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
      role: MembershipType.member,
      remainingSessions: 2,
    },
    title: "Select Your Sessions",
    sessions: [
      {
        label: "Monday, 12th May",
        memberAttendees: "32/35",
        casualAttendees: "4/5",
        value: "monday-session",
        addon: "ABA",
        description: "5:00 - 7:00 pm",
      },
      {
        label: "Wednesday, 14th May",
        memberAttendees: "28/35",
        casualAttendees: "2/5",
        value: "wednesday-session",
        addon: "UoA Rec",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Thursday, 15th May",
        memberAttendees: "25/30",
        casualAttendees: "3/5",
        value: "thursday-session",
        addon: "Kings School",
        description: "7:30 - 10:00 pm",
      },
      {
        label: "Friday, 16th May",
        memberAttendees: "30/35",
        casualAttendees: "1/5",
        value: "friday-session",
        addon: "UoA Rec Centre",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Saturday, 17th May",
        memberAttendees: "20/25",
        casualAttendees: "2/3",
        value: "saturday-session",
        addon: "ABA",
        description: "4:00 - 6:00 pm",
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
      role: MembershipType.casual,
      remainingSessions: 2,
    },
    title: "Choose Your Session",
    sessions: [
      {
        label: "Monday, 12th May",
        memberAttendees: "32/35",
        casualAttendees: "4/5",
        value: "monday-casual",
        addon: "ABA",
        description: "5:00 - 7:00 pm",
      },
      {
        label: "Wednesday, 14th May",
        memberAttendees: "28/35",
        casualAttendees: "2/5",
        value: "wednesday-casual",
        addon: "UoA Rec",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Thursday, 15th May",
        memberAttendees: "25/30",
        casualAttendees: "3/5",
        value: "thursday-casual",
        addon: "Kings School",
        description: "7:30 - 10:00 pm",
      },
      {
        label: "Friday, 16th May",
        memberAttendees: "30/35",
        casualAttendees: "1/5",
        value: "friday-casual",
        addon: "UoA Rec Centre",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Saturday, 17th May",
        memberAttendees: "20/25",
        casualAttendees: "2/3",
        value: "saturday-casual",
        addon: "ABA",
        description: "4:00 - 6:00 pm",
      },
    ],
    onSelect: (value) => console.log("Selected session:", value),
    onBack: () => console.log("Back button clicked"),
    onNext: (data) => console.log("Next button clicked with data:", data),
  },
}
