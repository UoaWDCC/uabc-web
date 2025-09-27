import { CreateBookingRequestSchema, MembershipType, type RequestWithUser } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import MailService from "@/business-layer/services/MailService"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import UserDataService from "@/data-layer/services/UserDataService"

class RouteWrapper {
  @Security("jwt")
  static async POST(req: RequestWithUser) {
    const gameSessionDataService = new GameSessionDataService()
    const userDataService = new UserDataService()
    const bookingDataService = new BookingDataService()

    try {
      const parsedBody = CreateBookingRequestSchema.parse(await req.json())

      const gameSession =
        typeof parsedBody.gameSession === "string"
          ? await gameSessionDataService.getGameSessionById(parsedBody.gameSession)
          : parsedBody.gameSession
      const sessionStartTime = new Date(gameSession.openTime)

      const now = new Date()
      if (now < sessionStartTime) {
        return NextResponse.json(
          { error: "Booking is not open yet for this session" },
          { status: StatusCodes.FORBIDDEN },
        )
      }

      const bookings = await bookingDataService.getAllBookingsBySessionId(gameSession.id)
      // Refetch user data as JWT stored data could be outdated
      const userData = await userDataService.getUserById(req.user.id)

      if ((userData.remainingSessions ?? 0) <= -1)
        return NextResponse.json(
          { error: "No remaining sessions" },
          { status: StatusCodes.FORBIDDEN },
        )

      if (
        (userData.role === MembershipType.casual &&
          bookings.length >= gameSession.casualCapacity) ||
        (userData.role === MembershipType.member && bookings.length >= gameSession.capacity)
      )
        return NextResponse.json(
          { error: "Session is full for the selected user role" },
          { status: StatusCodes.FORBIDDEN },
        )

      if (
        (await bookingDataService.getAllUserBookingsBySessionId(userData.id, gameSession.id))
          .length > 0
      )
        return NextResponse.json(
          { error: "Session already booked" },
          { status: StatusCodes.CONFLICT },
        )

      const newBooking = await bookingDataService.createBooking({
        ...parsedBody,
        user: userData,
      })

      await MailService.sendBookingConfirmation(newBooking)

      const newRemainingSessions = (userData.remainingSessions ?? 0) - 1
      // Demote user to casual if session count is lower than or equal to 0
      await userDataService.updateUser(req.user.id, {
        remainingSessions: newRemainingSessions,
        role: newRemainingSessions <= 0 ? MembershipType.casual : req.user.role,
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
