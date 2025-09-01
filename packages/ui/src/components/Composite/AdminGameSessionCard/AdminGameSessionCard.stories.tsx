import { GameSessionStatus } from "@repo/shared"
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

const baseGameSession = {
  id: "session-123",
  day: "Tuesday",
  status: GameSessionStatus.ONGOING,
  startTime: "2025-01-21T19:30:00Z",
  endTime: "2025-01-21T22:00:00Z",
  name: "UoA Rec Centre",
  location: "17 Symonds Street",
  attendees: 39,
  capacity: 40,
  casualAttendees: 5,
  casualCapacity: 10,
  openTime: "2025-01-21T18:30:00Z",
  semester: "semester-123",
  updatedAt: "2025-01-21T00:00:00Z",
  createdAt: "2025-01-21T00:00:00Z",
} as const

export const Default: Story = {
  args: {
    gameSession: baseGameSession,
  },
}

export const Upcoming: Story = {
  args: {
    gameSession: {
      ...baseGameSession,
      status: GameSessionStatus.UPCOMING,
      attendees: 25,
    },
  },
}

export const Past: Story = {
  args: {
    gameSession: {
      ...baseGameSession,
      status: GameSessionStatus.PAST,
      attendees: 40,
    },
  },
}

export const LowAttendance: Story = {
  args: {
    gameSession: {
      ...baseGameSession,
      attendees: 15,
    },
  },
}

export const FullCapacity: Story = {
  args: {
    gameSession: {
      ...baseGameSession,
      attendees: 40,
    },
  },
}
