import { type GetCurrentGameSessionsResponse, MembershipType, TimeframeFilter } from "@repo/shared"
import type { GameSessionSchedule, User } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { NotFound } from "payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

/**
 * GET method to fetch currently available game sessions for the current semester.
 *
 * @returns Array of currently available game sessions for the current semester
 */
export const GET = async (): Promise<NextResponse<GetCurrentGameSessionsResponse>> => {
  try {
    const semesterDataService = new SemesterDataService()
    const gameSessionDataService = new GameSessionDataService()
    const bookingDataService = new BookingDataService()

    const currentSemester = await semesterDataService.getCurrentSemester()
    const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
      currentSemester.id,
      TimeframeFilter.CURRENT,
    )

    const sessionIds = sessions.map((s) => s.id)
    const allBookings = await bookingDataService.getAllBookingsBySessionIds(sessionIds)

    const countsBySessionId = new Map<string, { attendees: number; casualAttendees: number }>()
    for (let i = 0; i < sessionIds.length; i++) {
      countsBySessionId.set(sessionIds[i], { attendees: 0, casualAttendees: 0 })
    }
    for (let i = 0; i < allBookings.length; i++) {
      const booking = allBookings[i]
      const sessionId =
        booking.gameSession && typeof booking.gameSession === "object"
          ? booking.gameSession.id
          : (booking.gameSession as string)
      const user = booking.user as User | string | null | undefined
      const counts = countsBySessionId.get(sessionId)
      if (!counts) continue

      if (user && typeof user === "object") {
        if (user.role === MembershipType.casual) {
          counts.casualAttendees++
        } else {
          counts.attendees++
        }
      } else {
        counts.attendees++
      }
    }

    const data = sessions.map((session) => {
      const location =
        session.gameSessionSchedule && typeof session.gameSessionSchedule === "object"
          ? (session.gameSessionSchedule as GameSessionSchedule).location
          : session.location
      const name =
        session.gameSessionSchedule && typeof session.gameSessionSchedule === "object"
          ? (session.gameSessionSchedule as GameSessionSchedule).name
          : session.name
      const counts = countsBySessionId.get(session.id) ?? { attendees: 0, casualAttendees: 0 }

      return {
        ...session,
        location,
        name,
        attendees: counts.attendees,
        casualAttendees: counts.casualAttendees,
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json(
        { error: "No current semester found" },
        { status: StatusCodes.NOT_FOUND },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
