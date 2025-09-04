import type { AdminGameSession } from "@repo/shared"
import {
  adminGameSessionBaseMock,
  adminGameSessionFullCapacityMock,
  adminGameSessionLowAttendanceMock,
  adminGameSessionUpcomingMock,
} from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { AdminSessionsCalendar } from "./AdminSessionsCalendar"

const meta: Meta<typeof AdminSessionsCalendar> = {
  title: "Composite Components / AdminSessionsCalendar",
  component: AdminSessionsCalendar,
  argTypes: {
    onDateSelect: { action: "date selected" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const createRelativeDate = (daysFromNow: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date
}

const createGameSession = (daysFromNow: number, attendees = 25): AdminGameSession => {
  const date = createRelativeDate(daysFromNow)
  const startTime = new Date(date)
  startTime.setHours(19, 30, 0, 0)
  const endTime = new Date(date)
  endTime.setHours(22, 0, 0, 0)
  const openTime = new Date(date)
  openTime.setHours(18, 30, 0, 0)

  return {
    ...adminGameSessionBaseMock,
    id: `session-${daysFromNow}`,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    openTime: openTime.toISOString(),
    attendees,
    casualAttendees: Math.floor(attendees * 0.2),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

const AdminSessionsCalendarWithState = ({
  gameSessions,
}: {
  gameSessions?: AdminGameSession[]
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <AdminSessionsCalendar
      gameSessions={gameSessions}
      onDateSelect={setSelectedDate}
      selectedDate={selectedDate}
    />
  )
}

export const Default: Story = {
  render: () => <AdminSessionsCalendarWithState />,
}

export const WithGameSessions: Story = {
  render: () => {
    const gameSessions = [
      createGameSession(1, 15), // Tomorrow
      createGameSession(3, 32), // Day after tomorrow
      createGameSession(7, 8), // Next week
      createGameSession(14, 40), // Two weeks from now (full capacity)
      createGameSession(21, 25), // Three weeks from now
    ]

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}

export const NoGameSessions: Story = {
  render: () => <AdminSessionsCalendarWithState gameSessions={[]} />,
}

export const HighAttendance: Story = {
  render: () => {
    const gameSessions = [
      createGameSession(1, 38), // Nearly full
      createGameSession(2, 40), // Completely full
      createGameSession(3, 35), // High attendance
    ]

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}

export const MultipleSessionsPerDay: Story = {
  render: () => {
    const today = new Date()
    const todayISO = today.toISOString().split("T")[0]

    const gameSessions = [
      {
        ...adminGameSessionBaseMock,
        id: "session-morning",
        startTime: `${todayISO}T14:00:00Z`,
        endTime: `${todayISO}T16:30:00Z`,
        attendees: 25,
      },
      {
        ...adminGameSessionUpcomingMock,
        id: "session-evening",
        startTime: `${todayISO}T19:30:00Z`,
        endTime: `${todayISO}T22:00:00Z`,
        attendees: 30,
      },
    ]

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}

export const UsingSharedMocks: Story = {
  render: () => {
    const today = new Date()
    const todayISO = today.toISOString().split("T")[0]

    const gameSessions = [
      {
        ...adminGameSessionLowAttendanceMock,
        id: "low-attendance",
        startTime: `${todayISO}T19:30:00Z`,
        endTime: `${todayISO}T22:00:00Z`,
      },
      {
        ...adminGameSessionFullCapacityMock,
        id: "full-capacity",
        startTime: `${todayISO}T14:00:00Z`,
        endTime: `${todayISO}T16:30:00Z`,
      },
    ]

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}

export const CustomStyling: Story = {
  render: () => (
    <AdminSessionsCalendar
      calendarProps={{
        size: "lg",
        colorScheme: "blue",
        borderWidth: "2px",
      }}
      gameSessions={[createGameSession(1, 20)]}
      onDateSelect={() => {}}
      selectedDate={new Date()}
    />
  ),
}
