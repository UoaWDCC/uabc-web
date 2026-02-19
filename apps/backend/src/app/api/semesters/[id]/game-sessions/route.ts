import { SearchParams, TimeframeFilter } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { countAttendees, getSessionProperties } from "@/data-layer/utils/GameSessionUtils"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const searchParams = req.nextUrl.searchParams
  const timeframe = (searchParams.get(SearchParams.SESSION_TIMEFRAME) ||
    TimeframeFilter.DEFAULT) as TimeframeFilter

  try {
    const semesterDataService = new SemesterDataService()
    const gameSessionDataService = new GameSessionDataService()
    const bookingDataService = new BookingDataService()

    const semester = await semesterDataService.getSemesterById(id)
    const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
      semester.id,
      timeframe,
    )

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
      return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
    }
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
