import type { AdminGameSession } from "@repo/shared"
import { createGameSessions } from "@repo/shared"
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
    const gameSessions = createGameSessions([
      { daysFromNow: 1, attendees: 15 }, // Tomorrow
      { daysFromNow: 3, attendees: 32 }, // Day after tomorrow
      { daysFromNow: 7, attendees: 8 }, // Next week
      { daysFromNow: 14, attendees: 40 }, // Two weeks from now (full capacity)
      { daysFromNow: 21, attendees: 25 }, // Three weeks from now
    ])

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}

export const NoGameSessions: Story = {
  render: () => <AdminSessionsCalendarWithState gameSessions={[]} />,
}

export const HighAttendance: Story = {
  render: () => {
    const gameSessions = createGameSessions([
      { daysFromNow: 1, attendees: 38 }, // Nearly full
      { daysFromNow: 2, attendees: 40 }, // Completely full
      { daysFromNow: 3, attendees: 35 }, // High attendance
    ])

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}

export const MultipleSessionsPerDay: Story = {
  render: () => {
    const gameSessions = createGameSessions([
      { daysFromNow: 0, attendees: 25, startHour: 14, endHour: 16 }, // Today morning
      { daysFromNow: 0, attendees: 30, startHour: 19, endHour: 22 }, // Today evening
    ])

    return <AdminSessionsCalendarWithState gameSessions={gameSessions} />
  },
}
