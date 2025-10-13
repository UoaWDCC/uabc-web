import type { Meta, StoryObj } from "@storybook/react"
import { GameSessionCard } from "./GameSessionCard"

const meta: Meta<typeof GameSessionCard> = {
  title: "Composite Components / GameSessionCard",
  component: GameSessionCard,
  parameters: { layout: "centered" },
  argTypes: {
    // Control the `session` object as a whole to keep types aligned
    session: { control: "object", description: "Session data" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    session: {
      name: "Tues HIWA Rec Centre",
      startTime: "7:30pm",
      endTime: "10:00pm",
      type: "Ongoing",
    },
    w: "sm",
  },
}

export const Upcoming: Story = {
  args: {
    session: {
      name: "Wed King's School",
      startTime: "7:00pm",
      endTime: "9:00pm",
      type: "Upcoming",
    },
    w: "sm",
  },
}

export const Past: Story = {
  args: {
    session: {
      name: "Fri HIWA Rec Centre",
      startTime: "6:00pm",
      endTime: "8:00pm",
      type: "Past",
    },
    w: "sm",
  },
}
