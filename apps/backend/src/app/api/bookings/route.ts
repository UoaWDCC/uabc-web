import {
  CreateBookingRequestBodySchema,
  type CreateBookingRequestBodyType,
  MembershipType,
  type RequestWithUser,
} from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import UserDataService from "@/data-layer/services/UserDataService"

class RouteWrapper {
  @Security("jwt")
  static async POST(req: RequestWithUser) {
    try {
      const parsedBody: CreateBookingRequestBodyType = CreateBookingRequestBodySchema.parse(
        await req.json(),
      )
      const gameSessionDataService = new GameSessionDataService()
      const userDataService = new UserDataService()
      const bookingDataService = new BookingDataService()

      const gameSession =
        typeof parsedBody.gameSession === "string"
          ? await gameSessionDataService.getGameSessionById(parsedBody.gameSession)
          : parsedBody.gameSession
      const bookings = await bookingDataService.getBookingsBySessionId(gameSession.id)

      if (req.user.remainingSessions === 0) {
        return NextResponse.json(
          { error: "No remaining sessions" },
          { status: StatusCodes.FORBIDDEN },
        )
      }

      if (
        (req.user.role === MembershipType.casual &&
          bookings.length >= gameSession.casualCapacity) ||
        (req.user.role === MembershipType.member && bookings.length >= gameSession.capacity)
      ) {
        return NextResponse.json(
          { error: "Session is full for the selected user role" },
          { status: StatusCodes.FORBIDDEN },
        )
      }

      const newBooking = await bookingDataService.createBooking({
        ...parsedBody,
        user: req.user,
      })

      if (req.user.remainingSessions) {
        const newRemainingSessions = req.user.remainingSessions - 1

        await userDataService.updateUser(req.user.id, {
          remainingSessions: newRemainingSessions,
          role: newRemainingSessions === 0 && req.user.role === MembershipType.member ? MembershipType.casual : req.user.role,
        })
      }

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
