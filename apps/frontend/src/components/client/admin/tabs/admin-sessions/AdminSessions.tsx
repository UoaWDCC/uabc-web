"use client"

import type { AdminGameSession, GameSessionWithCounts } from "@repo/shared"
import { dayjs, GameSessionStatus, type PlayLevel, Weekday } from "@repo/shared"
import type { Booking, User } from "@repo/shared/payload-types"
import {
  AdminGameSessionCard,
  AdminSessionsCalendar,
  AdminSessionsTable,
} from "@repo/ui/components/Composite"
import type { SessionData } from "@repo/ui/components/Composite/AdminSessionsTable/Columns"
import { Grid, GridItem, VStack } from "@yamada-ui/react"
import { parseAsString, useQueryState } from "nuqs"
import { useMemo } from "react"
import { useGetAllGameSessionBookings } from "@/services/admin/game-session/AdminGameSessionQueries"
import { useGetCurrentGameSessions } from "@/services/game-session/GameSessionQueries"

/**
 * Transform booking data to SessionData format for the table
 */
const transformBookingToSessionData = (booking: Booking): SessionData => {
  const user = booking.user as User
  const fullName = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName

  return {
    id: booking.id,
    name: fullName,
    email: user.email,
    role: user.role,
    level: booking.playerLevel as PlayLevel,
    sessions: user.remainingSessions?.toString() || "0",
  }
}

/**
 * Transform GameSessionWithCounts to AdminGameSession format
 */
const transformToAdminGameSession = (session: GameSessionWithCounts): AdminGameSession => {
  const startTime = new Date(session.startTime)
  const dayOfWeek = startTime.getDay()
  const weekdayMap = [
    Weekday.sunday,
    Weekday.monday,
    Weekday.tuesday,
    Weekday.wednesday,
    Weekday.thursday,
    Weekday.friday,
    Weekday.saturday,
  ]

  // Determine session status based on current time
  const now = new Date()
  let status: GameSessionStatus
  if (now < new Date(session.openTime)) {
    status = GameSessionStatus.UPCOMING
  } else if (now > new Date(session.endTime)) {
    status = GameSessionStatus.PAST
  } else {
    status = GameSessionStatus.ONGOING
  }

  return {
    ...session,
    day: weekdayMap[dayOfWeek],
    status,
  }
}

/**
 * AdminSessions component for managing and viewing game sessions
 *
 * Provides a comprehensive interface for admins to view sessions by date,
 * see session details, and manage attendees. The component includes:
 * - Calendar for date selection
 * - Session details card
 * - Attendees table with filtering and search
 *
 * @returns The AdminSessions component
 */
export const AdminSessions = () => {
  const [dateParam, setDateParam] = useQueryState("date", parseAsString)

  // Get current game sessions with attendee counts
  const { data: gameSessionsData } = useGetCurrentGameSessions()

  const selectedDate = useMemo(() => {
    if (!dateParam) {
      return
    }
    const parsedDate = dayjs.tz(dateParam, "YYYY-MM-DD", "Pacific/Auckland").toDate()
    return parsedDate
  }, [dateParam])

  // Transform game sessions to admin format
  const adminGameSessions = useMemo(() => {
    if (!gameSessionsData?.data) {
      return []
    }
    return gameSessionsData.data.map(transformToAdminGameSession)
  }, [gameSessionsData])

  const selectedSession = useMemo(() => {
    if (!selectedDate || !adminGameSessions.length) {
      return
    }
    const dateString = dayjs(selectedDate).format("YYYY-MM-DD")
    return adminGameSessions.find((session) => {
      const sessionDate = dayjs(session.startTime).format("YYYY-MM-DD")
      return sessionDate === dateString
    })
  }, [selectedDate, adminGameSessions])

  // Fetch bookings for the selected session
  const { data: bookingsData } = useGetAllGameSessionBookings(selectedSession?.id || "")

  // Transform bookings to session data for the table
  const selectedSessionAttendees = useMemo(() => {
    if (!bookingsData?.data) {
      return []
    }
    return bookingsData.data.map(transformBookingToSessionData)
  }, [bookingsData])

  const handleDateSelect = (date: Date) => {
    const dateString = dayjs.tz(date, "Pacific/Auckland").format("YYYY-MM-DD")
    setDateParam(dateString)
  }

  const handleExport = () => {
    if (!selectedSession) {
      console.warn("No session to export")
      return
    }

    // Create CSV content
    const headers = ["Name", "Email", "Role", "Level", "Remaining Sessions"]
    const csvRows = [
      headers.join(","),
      ...selectedSessionAttendees.map((attendee) =>
        [
          `"${attendee.name}"`,
          `"${attendee.email}"`,
          `"${attendee.role}"`,
          `"${attendee.level}"`,
          `"${attendee.sessions}"`,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `session-attendees-${dayjs(selectedSession.startTime).format("YYYY-MM-DD")}.csv`,
    )
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log("Exported member list for session:", selectedSession.id)
  }

  return (
    <Grid gap="lg" h="full" minH="600px" templateColumns={{ base: "1fr", lg: "23rem 1fr" }}>
      {/* Left Panel - Calendar and Session Details */}
      <GridItem>
        <VStack gap="lg" h="full">
          <AdminSessionsCalendar
            gameSessions={adminGameSessions}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
          {selectedSession && (
            <AdminGameSessionCard gameSession={selectedSession} onExport={handleExport} />
          )}
        </VStack>
      </GridItem>

      {/* Right Panel - Attendees Table */}
      <GridItem>
        <VStack gap="md" h="full">
          <AdminSessionsTable data={selectedSessionAttendees} />
        </VStack>
      </GridItem>
    </Grid>
  )
}
