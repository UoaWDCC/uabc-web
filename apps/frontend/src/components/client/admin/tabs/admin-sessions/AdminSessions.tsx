"use client"

import type { AdminGameSession, GameSessionWithCounts } from "@repo/shared"
import { dayjs, GameSessionStatus, type PlayLevel, Popup, Weekday } from "@repo/shared"
import type { Booking, User } from "@repo/shared/payload-types"
import {
  AdminGameSessionCard,
  AdminSessionsCalendar,
  AdminSessionsTable,
  ChangeSessionPopup,
} from "@repo/ui/components/Composite"
import type { SessionData } from "@repo/ui/components/Composite/AdminSessionsTable/Columns"
import { usePopupState } from "@repo/ui/hooks"
import { Grid, GridItem, useNotice, VStack } from "@yamada-ui/react"
import { parseAsString, useQueryState } from "nuqs"
import { useMemo, useState } from "react"
import { useUpdateBooking } from "@/services/admin/bookings/AdminBookingMutations"
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
  const [changeSessionFlowDateParam, setChangeSessionFlowDateParam] = useQueryState(
    "change-session-flow-date",
    parseAsString,
  )
  const [bookingToChange, setBookingToChange] = useState<SessionData | null>(null)
  const notice = useNotice()

  const changeSessionPopup = usePopupState({
    popupId: Popup.CHANGE_SESSION_FLOW,
    initialValue: "",
    onClose: () => {
      setBookingToChange(null)
    },
  })

  const updateBookingMutation = useUpdateBooking()

  const { data: gameSessionsData } = useGetCurrentGameSessions()

  const selectedDate = useMemo(() => {
    if (!dateParam) {
      return
    }
    const parsedDate = dayjs.tz(dateParam, "YYYY-MM-DD", "Pacific/Auckland").toDate()
    return parsedDate
  }, [dateParam])

  const changeSessionFlowDate = useMemo(() => {
    if (!changeSessionFlowDateParam) {
      return null
    }
    const parsedDate = dayjs
      .tz(changeSessionFlowDateParam, "YYYY-MM-DD", "Pacific/Auckland")
      .toDate()
    return parsedDate
  }, [changeSessionFlowDateParam])

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

  const { data: bookingsData } = useGetAllGameSessionBookings(selectedSession?.id || "")

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

  const handleChangeSessionDateSelect = (date: Date | null) => {
    if (date) {
      const dateString = dayjs.tz(date, "Pacific/Auckland").format("YYYY-MM-DD")
      setChangeSessionFlowDateParam(dateString)
    } else {
      setChangeSessionFlowDateParam(null)
    }
  }

  const handleExport = () => {
    if (selectedSession) {
      console.log("Exporting member list for session:", selectedSession.id)
    }
  }

  const handleChangeSession = () => {
    changeSessionPopup.open()
  }

  const handleTableChangeSession = (row: SessionData) => {
    setBookingToChange(row)
    changeSessionPopup.open()
  }

  const handleSessionConfirm = (newSession: AdminGameSession) => {
    if (!bookingToChange) {
      return
    }

    updateBookingMutation.mutate(
      {
        bookingId: bookingToChange.id,
        data: {
          gameSession: newSession.id,
        },
      },
      {
        onSuccess: () => {
          notice({
            title: "Booking updated",
            description: "Booking updated successfully",
            status: "success",
          })
          setBookingToChange(null)
          changeSessionPopup.close()
        },
        onError: (error) => {
          console.error("Failed to update booking:", error)
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while updating the booking. Please try again.",
            status: "error",
          })
        },
      },
    )
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
            <AdminGameSessionCard
              gameSession={selectedSession}
              onChangeSession={handleChangeSession}
              onExport={handleExport}
            />
          )}
        </VStack>
      </GridItem>

      {/* Right Panel - Attendees Table */}
      <GridItem>
        <VStack gap="md" h="full">
          <AdminSessionsTable
            data={selectedSessionAttendees}
            onChangeSession={handleTableChangeSession}
          />
        </VStack>
      </GridItem>

      {/* Change Session Flow */}
      <ChangeSessionPopup
        availableSessions={adminGameSessions}
        currentSession={selectedSession}
        isLoading={updateBookingMutation.isPending}
        isOpen={changeSessionPopup.isOpen}
        onClose={changeSessionPopup.close}
        onConfirm={handleSessionConfirm}
        onDateSelect={handleChangeSessionDateSelect}
        popupId={Popup.CHANGE_SESSION_FLOW}
        selectedDate={changeSessionFlowDate}
      />
    </Grid>
  )
}
