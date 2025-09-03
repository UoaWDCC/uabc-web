import {
  adminGameSessionBaseMock,
  adminGameSessionPastMock,
  adminGameSessionUpcomingMock,
} from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import { AdminGameSessionCard } from "./AdminGameSessionCard"

const meta: Meta<typeof AdminGameSessionCard> = {
  title: "Composite Components / AdminGameSessionCard",
  component: AdminGameSessionCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    gameSession: {
      control: { type: "object" },
    },
    onExport: { action: "export clicked" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    gameSession: adminGameSessionBaseMock,
  },
}

export const Upcoming: Story = {
  args: {
    gameSession: adminGameSessionUpcomingMock,
  },
}

export const Past: Story = {
  args: {
    gameSession: adminGameSessionPastMock,
  },
}

export const LowAttendance: Story = {
  args: {
    gameSession: { ...adminGameSessionBaseMock, attendees: 15 },
  },
}

export const FullCapacity: Story = {
  args: {
    gameSession: { ...adminGameSessionBaseMock, attendees: 40 },
  },
}
