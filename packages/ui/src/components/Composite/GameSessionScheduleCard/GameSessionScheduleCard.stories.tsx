import type { Meta, StoryObj } from "@storybook/react"
import { GameSessionScheduleCard } from "./GameSessionScheduleCard"

const meta: Meta<typeof GameSessionScheduleCard> = {
  title: "Composite Components / GameSessionScheduleCard",
  component: GameSessionScheduleCard,
  parameters: { layout: "centered" },
  argTypes: {
    // Control the `gameSessionSchedule` object as a whole to keep types aligned
    gameSessionSchedule: { control: "object", description: "Game session schedule data" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    gameSessionSchedule: {
      id: "default-id",
      name: "Tues HIWA Rec Centre",
      location: "HIWA Rec Centre",
      semester: "",
      day: "tuesday" as any,
      startTime: "7:30pm",
      endTime: "10:00pm",
      capacity: 40,
      casualCapacity: 10,
      updatedAt: "",
      createdAt: "",
    },
    w: "sm",
  },
}

export const Upcoming: Story = {
  args: {
    gameSessionSchedule: {
      id: "upcoming-id",
      name: "Wed King's School",
      location: "King's School",
      semester: "",
      day: "wednesday" as any,
      startTime: "7:00pm",
      endTime: "9:00pm",
      capacity: 30,
      casualCapacity: 5,
      updatedAt: "",
      createdAt: "",
    },
    w: "sm",
  },
}

export const Past: Story = {
  args: {
    gameSessionSchedule: {
      id: "past-id",
      name: "Fri HIWA Rec Centre",
      location: "HIWA Rec Centre",
      semester: "",
      day: "friday" as any,
      startTime: "6:00pm",
      endTime: "8:00pm",
      capacity: 35,
      casualCapacity: 8,
      updatedAt: "",
      createdAt: "",
    },
    w: "sm",
  },
}
