import { MembershipType, SearchParams, TimeframeFilter } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const searchParams = req.nextUrl.searchParams
  const timeframe = (searchParams.get(SearchParams.SESSION_TIMEFRAME) ||
    TimeframeFilter.DEFAULT) as TimeframeFilter

  const semesterDataService = new SemesterDataService()
  const gameSessionDataService = new GameSessionDataService()
  const bookingDataService = new BookingDataService()

  try {
    const semester = await semesterDataService.getSemesterById(id)
    const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
      semester.id,
      timeframe,
    )

    await Promise.all(
      sessions.map(async (session) => {
        const sessionBookings = await bookingDataService.getAllBookingsBySessionId(id)

        const casualBookings = sessionBookings.filter(
          (booking) => (booking.user as User)?.role === MembershipType.casual,
        ).length

        return {
          ...session,
          casualCapacityStatus: casualBookings,
          memberCapacityStatus: sessionBookings.length - casualBookings,
        }
      }),
    )

    return NextResponse.json({ data: sessions })
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
