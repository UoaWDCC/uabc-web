import {
  getPayloadObjectId,
  MembershipType,
  type RequestWithUser,
  UpdateBookingRequestSchema,
} from "@repo/shared"
import type { GameSession } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import UserDataService from "@/data-layer/services/UserDataService"

class RouteWrapper {
  @Security("jwt")
  static async PATCH(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const gameSessionDataService = new GameSessionDataService()
    const userDataService = new UserDataService()
    const bookingDataService = new BookingDataService()

    try {
      const initialBooking = await bookingDataService.getBookingById(id)
      // Throw payload not found when the user doesn't own this booking
      if (getPayloadObjectId(initialBooking.user) !== req.user.id) {
        throw new NotFound()
      }

      const now = new Date()

      if (new Date((initialBooking.gameSession as GameSession).startTime) < now) {
        return NextResponse.json(
          { error: "The booking game session start time has already passed" },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const parsedBody = UpdateBookingRequestSchema.parse(await req.json())

      // Only update if gameSession is specified and different from the existing booking,
      // else can be updating other fields such as playLevel
      if (
        parsedBody.gameSession &&
        getPayloadObjectId(parsedBody.gameSession) !==
          getPayloadObjectId(initialBooking.gameSession)
      ) {
        let gameSession: GameSession
        try {
          gameSession =
            typeof parsedBody.gameSession === "string"
              ? await gameSessionDataService.getGameSessionById(parsedBody.gameSession)
              : parsedBody.gameSession
        } catch (error) {
          if (error instanceof NotFound) {
            return NextResponse.json(
              { error: "The updated booking's game session was not found" },
              { status: StatusCodes.NOT_FOUND },
            )
          }
          throw error
        }

        const sessionStartTime = new Date(gameSession.openTime)
        if (now < sessionStartTime) {
          return NextResponse.json(
            { error: "Booking is not open yet for this session" },
            { status: StatusCodes.FORBIDDEN },
          )
        }

        const bookings = await bookingDataService.getAllBookingsBySessionId(gameSession.id)
        // Refetch user data as JWT stored data could be outdated
        const userData = await userDataService.getUserById(req.user.id)
        if (bookings.some((booking) => getPayloadObjectId(booking.user) === userData.id))
          return NextResponse.json(
            { error: "A booking with that session has already been made" },
            { status: StatusCodes.CONFLICT },
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
      }

      const updatedBooking = await bookingDataService.updateBooking(id, parsedBody)

      return NextResponse.json({ data: updatedBooking }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Booking not found" }, { status: StatusCodes.NOT_FOUND })
      }
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

export const { PATCH } = RouteWrapper
