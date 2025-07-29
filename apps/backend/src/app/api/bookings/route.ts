import {
  CreateBookingRequestBodySchema,
  getDaysUntilNextDayOfWeekEnum,
  MembershipType,
  type RequestWithUser,
  Weekday,
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
    const gameSessionDataService = new GameSessionDataService()
    const userDataService = new UserDataService()
    const bookingDataService = new BookingDataService()

    try {
      const parsedBody = CreateBookingRequestBodySchema.parse(await req.json())

      const gameSession =
        typeof parsedBody.gameSession === "string"
          ? await gameSessionDataService.getGameSessionById(parsedBody.gameSession)
          : parsedBody.gameSession
      const semester = typeof gameSession.semester === "string" ? undefined : gameSession.semester
      if (semester) {
        const sessionStartTime = new Date(gameSession.startTime)
        const openDay = semester.bookingOpenDay
        const openTime = new Date(semester.bookingOpenTime)
        const sessionDayIndex = sessionStartTime.getDay()

        // Calculate the booking open date as the week before the session
        const openDate = new Date(sessionStartTime)
        openDate.setDate(
          sessionStartTime.getDate() -
            7 +
            getDaysUntilNextDayOfWeekEnum(
              openDay as Weekday,
              Object.values(Weekday)[sessionDayIndex] as Weekday,
            ),
        )
        openDate.setHours(openTime.getHours(), openTime.getMinutes(), openTime.getSeconds(), 0)

        const now = new Date()
        if (now < openDate) {
          return NextResponse.json(
            { error: "Booking is not open yet for this session" },
            { status: StatusCodes.FORBIDDEN },
          )
        }
        // Disallow booking for sessions scheduled before the open date/time
        if (sessionStartTime < openDate) {
          return NextResponse.json(
            { error: "Cannot book a session scheduled before the semester's booking open time" },
            { status: StatusCodes.FORBIDDEN },
          )
        }
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
