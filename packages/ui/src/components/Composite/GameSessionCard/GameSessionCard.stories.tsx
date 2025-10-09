import type { Meta, StoryObj } from "@storybook/react"
import { GameSessionCard } from "./GameSessionCard"

const meta: Meta<typeof GameSessionCard> = {
  title: "Composite Components / GameSessionCard",
  component: GameSessionCard,
  parameters: { layout: "centered" },
  argTypes: {
    name: { control: "text", description: "Session name" },
    startTime: { control: "text" },
    endTime: { control: "text" },
    type: { control: { type: "select" }, options: ["Ongoing", "Upcoming", "Past"] },
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
