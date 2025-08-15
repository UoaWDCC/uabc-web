import { type GetCurrentGameSessionsResponse, TimeframeFilter } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { NotFound } from "payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { countAttendees, getSessionProperties } from "@/data-layer/utils/GameSessionUtils"

/**
 * GET method to fetch currently available game sessions for the current semester
 *
 * Retrieves active game sessions along with their attendee counts, optimized for
 * performance with efficient database queries and data transformation.
 *
 * @returns JSON response containing array of current game sessions with attendee data
 */
export const GET = async (): Promise<
  NextResponse<GetCurrentGameSessionsResponse | { error: string }>
> => {
  try {
    const semesterDataService = new SemesterDataService()
    const gameSessionDataService = new GameSessionDataService()
    const bookingDataService = new BookingDataService()

    const currentSemester = await semesterDataService.getCurrentSemester()

    const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
      currentSemester.id,
      TimeframeFilter.CURRENT,
    )

    if (sessions.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const sessionIds = sessions.map((session) => session.id)
    const allBookings = await bookingDataService.getAllBookingsBySessionIds(sessionIds)

    const attendeeCounts = countAttendees(allBookings)

    const enhancedSessions = sessions.map((session) => {
      const { location, name } = getSessionProperties(session)
      const counts = attendeeCounts.get(session.id) ?? { attendees: 0, casualAttendees: 0 }

      return {
        ...session,
        location,
        name,
        attendees: counts.attendees,
        casualAttendees: counts.casualAttendees,
      }
    })

    return NextResponse.json({ data: enhancedSessions })
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json(
        { error: "No current semester found" },
        { status: StatusCodes.NOT_FOUND },
      )
    }

    const errorContext = {
      endpoint: "/api/game-sessions/current",
      method: "GET",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "UnknownError",
        stack: error instanceof Error ? error.stack : undefined,
      },
    }

    console.error("Failed to fetch current game sessions:", errorContext)

    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
