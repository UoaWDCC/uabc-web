import { BookingSchema, type BookingType } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import UserDataService from "@/data-layer/services/UserDataService"

class RouteWrapper {
  @Security("jwt")
  static async POST(req: NextRequest) {
    try {
      const parsedBody: BookingType = BookingSchema.parse(await req.json())
      const gameSessionDataService = new GameSessionDataService()
      const userDataService = new UserDataService()
      const bookingDataService = new BookingDataService()

      const newBooking = await bookingDataService.createBooking(parsedBody)
      const user =
        typeof newBooking.user === "string"
          ? await userDataService.getUserById(newBooking.user)
          : newBooking.user
      const gameSession =
        typeof newBooking.gameSession === "string"
          ? await gameSessionDataService.getGameSessionById(newBooking.gameSession)
          : newBooking.gameSession
      const bookings = await bookingDataService.getBookingsBySessionId(gameSession.id)

      if (
        (user.role === "casual" && bookings.length > gameSession.casualCapacity) ||
        (user.role === "member" && bookings.length > gameSession.capacity)
      ) {
        await bookingDataService.deleteBooking(newBooking.id)

        return NextResponse.json(
          { error: "Session is full for the selected user role" },
          { status: StatusCodes.FORBIDDEN },
        )
      }

      await userDataService.updateUser(user.id, {
        remainingSessions: user.remainingSessions ? user.remainingSessions - 1 : 0,
      })

      return NextResponse.json({ data: newBooking }, { status: StatusCodes.CREATED })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request body", details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { POST } = RouteWrapper
