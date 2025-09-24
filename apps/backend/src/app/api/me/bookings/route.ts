import { BookingQueryType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class RouteWrapper {
  @Security("jwt")
  static async GET(req: NextRequest & { user: User }) {
    try {
      const bookingDataService = new BookingDataService()
      const gameSessionDataService = new GameSessionDataService()
      const { searchParams } = new URL(req.url)
      const type = searchParams.get("type") ?? BookingQueryType.ALL

      if (!Object.values(BookingQueryType).includes(type as BookingQueryType)) {
        return NextResponse.json(
          { error: "Invalid query parameters", details: "Invalid query type provided" },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      let bookings = await bookingDataService.getAllBookingsByUserId(req.user.id)

      if (type === BookingQueryType.FUTURE) {
        bookings = bookings.filter(async (booking) => {
          const gameSession = await gameSessionDataService.getGameSessionById(
            typeof booking.gameSession === "string" ? booking.gameSession : booking.gameSession.id,
          )
          return new Date(gameSession.startTime).getTime() > Date.now()
        })
      }

      return NextResponse.json({ data: bookings })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { GET } = RouteWrapper
