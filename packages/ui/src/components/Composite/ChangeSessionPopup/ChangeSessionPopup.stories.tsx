import type { AdminGameSession } from "@repo/shared"
import { GameSessionStatus, Popup } from "@repo/shared"
import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { createCurrentSession, createGameSessions } from "../story-utils"
import { ChangeSessionPopup } from "./ChangeSessionPopup"

const meta: Meta<typeof ChangeSessionPopup> = {
  title: "Composite Components / ChangeSessionPopup",
  component: ChangeSessionPopup,
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the popup is currently open",
    },
    availableSessions: {
      control: false,
      description: "Array of available game sessions to choose from",
    },
    selectedDate: {
      control: false,
      description: "Currently selected date",
    },
    currentSession: {
      control: false,
      description: "Current session being viewed/changed",
    },
  },
  args: {
    onClose: () => {},
    onDateSelect: () => {},
    onConfirm: () => {},
  },
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  parameters: {
    query: {
      [Popup.CHANGE_SESSION]: "open",
    },
  },
}

export default meta
type Story = StoryObj<typeof ChangeSessionPopup>

const mockSessions: AdminGameSession[] = createGameSessions([
  {
    daysFromNow: 1,
    attendees: 39,
    status: GameSessionStatus.ONGOING,
  },
  {
    daysFromNow: 3,
    attendees: 25,
    status: GameSessionStatus.UPCOMING,
  },
  {
    daysFromNow: -2,
    attendees: 40,
    status: GameSessionStatus.PAST,
    startHour: 14,
    endHour: 17,
  },
])

const currentSession: AdminGameSession = createCurrentSession(0, 35, GameSessionStatus.ONGOING)

export const Default: Story = {
  args: {
    isOpen: true,
    availableSessions: mockSessions,
    currentSession,
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}

export const WithSelectedDate: Story = {
  args: {
    isOpen: true,
    availableSessions: mockSessions,
    currentSession,
    selectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}

export const NoCurrentSession: Story = {
  args: {
    isOpen: true,
    availableSessions: mockSessions,
    currentSession: null,
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}

export const NoAvailableSessions: Story = {
  args: {
    isOpen: true,
    availableSessions: [],
    currentSession,
    selectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    availableSessions: mockSessions,
    currentSession,
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}

export const HighAttendanceSessions: Story = {
  args: {
    isOpen: true,
    availableSessions: createGameSessions([
      { daysFromNow: 1, attendees: 38, status: GameSessionStatus.UPCOMING }, // Nearly full
      { daysFromNow: 2, attendees: 40, status: GameSessionStatus.UPCOMING }, // Completely full
      { daysFromNow: 3, attendees: 35, status: GameSessionStatus.UPCOMING }, // High attendance
    ]),
    currentSession,
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}

export const MultipleSessionsPerDay: Story = {
  args: {
    isOpen: true,
    availableSessions: createGameSessions([
      { daysFromNow: 1, attendees: 25, startHour: 14, endHour: 16 }, // Tomorrow morning
      { daysFromNow: 1, attendees: 30, startHour: 19, endHour: 22 }, // Tomorrow evening
      { daysFromNow: 2, attendees: 20, startHour: 10, endHour: 12 }, // Day after morning
    ]),
    currentSession,
    selectedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    title: "Change Session",
    description: "Select a new date to view available sessions",
  },
}
