import { UpdateGameSessionRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class GameSessionRouteWrapper {
  /**
   * DELETE method to delete a game session.
   *
   * @param _req The request object
   * @param params route parameters containing the GameSession ID
   * @returns No content status code
   */
  @Security("jwt", ["admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const bookingDataService = new BookingDataService()
      const gameSessionDataService = new GameSessionDataService()
      const gameSession = await gameSessionDataService.getGameSessionById(id)

      await gameSessionDataService.deleteGameSession(id)

      if (gameSession.gameSessionSchedule) {
        await gameSessionDataService.deleteGameSessionSchedule(
          typeof gameSession.gameSessionSchedule === "string"
            ? gameSession.gameSessionSchedule
            : gameSession.gameSessionSchedule.id,
        )
      }

      const bookings = await bookingDataService.getBookingsBySessionId(gameSession.id)

      if (bookings.length > 0) {
        await Promise.all(bookings.map((booking) => bookingDataService.deleteBooking(booking.id)))
      }

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json(
          { error: "Game session not found" },
          { status: StatusCodes.NOT_FOUND },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
  /**
   * PATCH method to update a gameSession.
   *
   * @param req The request object containing the request body
   * @returns  The updated  {@link gameSession} document
   */
  @Security("jwt", ["admin"])
  static async PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const parsedBody = UpdateGameSessionRequestSchema.parse(await req.json())
      const gameSessionDataService = new GameSessionDataService()
      const updatedGameSession = await gameSessionDataService.updateGameSession(id, parsedBody)
      return NextResponse.json({ data: updatedGameSession }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json(
          { error: "Game session not found" },
          { status: StatusCodes.NOT_FOUND },
        )
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

export const { DELETE, PATCH } = GameSessionRouteWrapper
