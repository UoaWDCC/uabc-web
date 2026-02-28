"use client"

import type { AdminGameSession, GameSessionWithCounts } from "@repo/shared"
import { dayjs, type GameSessionStatus, type PlayLevel, Popup, Weekday } from "@repo/shared"
import type { Booking, User } from "@repo/shared/payload-types"
import {
  formatDateToISOString,
  getDateTimeStatus,
  isSameDate,
  parseISOStringToDate,
} from "@repo/shared/utils/date"
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
import { useMemo } from "react"
import { buildCsvFromRecords } from "@/lib/csv"
import { downloadCsvFile } from "@/lib/file-download"
import { useUpdateBooking } from "@/services/admin/bookings/AdminBookingMutations"
import { useGetAllGameSessionBookings } from "@/services/admin/game-session/AdminGameSessionQueries"
import { useGetAllGameSessionsBySemester } from "@/services/game-session/GameSessionQueries"
import { useGetCurrentSemester } from "@/services/semester/SemesterQueries"

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
  const status: GameSessionStatus = getDateTimeStatus(session.openTime, session.endTime)

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
  const notice = useNotice()

  const changeSessionPopup = usePopupState({
    popupId: Popup.CHANGE_SESSION_FLOW,
    initialValue: "",
    onValueChange: () => {
      // The booking ID is now managed through the URL parameter
    },
    onClose: () => {
      // Clear the booking ID from URL when closing
      changeSessionPopup.clearValue()
    },
  })

  const updateBookingMutation = useUpdateBooking()

  // Get current game sessions with attendee counts
  const { data: semesterData } = useGetCurrentSemester()
  const { data: gameSessionsData } = useGetAllGameSessionsBySemester(semesterData?.data.id || "")

  const selectedDate = useMemo(() => {
    if (!dateParam) {
      return
    }
    return parseISOStringToDate(dateParam)
  }, [dateParam])

  const changeSessionFlowDate = useMemo(() => {
    if (!changeSessionFlowDateParam) {
      return null
    }
    return parseISOStringToDate(changeSessionFlowDateParam)
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
    return adminGameSessions.find((session) => {
      return isSameDate(selectedDate, new Date(session.startTime))
    })
  }, [selectedDate, adminGameSessions])

  const { data: bookingsData } = useGetAllGameSessionBookings(selectedSession?.id || "")

  const selectedSessionAttendees = useMemo(() => {
    if (!bookingsData?.data) {
      return []
    }
    return bookingsData.data.map(transformBookingToSessionData)
  }, [bookingsData])

  const bookingToChange = useMemo(() => {
    const bookingId = changeSessionPopup.value
    if (!bookingId || !selectedSessionAttendees.length) {
      return null
    }
    return selectedSessionAttendees.find((attendee) => attendee.id === bookingId) || null
  }, [changeSessionPopup.value, selectedSessionAttendees])

  const handleDateSelect = (date: Date) => {
    const dateString = formatDateToISOString(date)
    setDateParam(dateString)
  }

  const handleChangeSessionDateSelect = (date: Date | null) => {
    if (date) {
      const dateString = formatDateToISOString(date)
      setChangeSessionFlowDateParam(dateString)
    } else {
      setChangeSessionFlowDateParam(null)
    }
  }

  const handleExport = () => {
    if (!selectedSession) {
      return
    }

    const csvContent = buildCsvFromRecords(selectedSessionAttendees)
    const sessionDate = dayjs(selectedSession.startTime)
    const formattedDate = sessionDate.isValid() ? sessionDate.format("YYYY-MM-DD") : "unknown-date"
    const filename = `session-attendees-${formattedDate}.csv`

    downloadCsvFile(csvContent, filename)
  }

  const handleTableChangeSession = (row: SessionData) => {
    changeSessionPopup.setValue(row.id)
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
            <AdminGameSessionCard gameSession={selectedSession} onExport={handleExport} />
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
