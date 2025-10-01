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

// it("should return all future paginated game sessions if query type is set to future", async () => {
//   cookieStore.set(AUTH_COOKIE_NAME, memberToken)

//   const { id } = await gameSessionDataService.createGameSession(futureGameSessionCreateMock)

//   const bookingsToCreate = [
//     ...Array.from({ length: 15 }, (_, _i) => ({
//       ...bookingCreateMock,
//     })),
//     {
//       ...futureBookingCreateMock,
//       gameSession: id,
//     },
//   ]
//   await Promise.all(bookingsToCreate.map((u) => bookingDataService.createBooking(u)))

//   const req = createMockNextRequest("/api/bookings?limit=10&page=1&type=future")
//   const res = await GET(req)

//   expect(res.status).toBe(StatusCodes.OK)
//   const json = await res.json()
//   expect(json.data.docs.length).toBe(1)
//   expect(json.data.page).toBe(1)
//   expect(json.data.limit).toBe(10)
//   expect(json.data.docs[0].gameSession).toBe(id)
//   expect(new Date(json.data.docs[0].startTime).getTime()).toBeGreaterThan(Date.now())
// })
