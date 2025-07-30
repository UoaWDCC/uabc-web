import { UpdateGameSessionScheduleRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import { payload } from "@/data-layer/adapters/Payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class RouteWrapper {
  /**
   * GET method to fetch a game session schedule.
   *
   * @param _req The request object
   * @param params route parameters containing the GameSessionSchedule ID
   * @returns OK code and the game session schedule data
   */
  @Security("jwt", ["admin"])
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const gameSessionDataService = new GameSessionDataService()
      const gameSessionSchedule = await gameSessionDataService.getGameSessionScheduleById(id)
      return NextResponse.json(gameSessionSchedule, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json(
          { error: "Game session schedule not found" },
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
   * PATCH Method to update a game session schedule.
   *
   * @param req The request object containing the request body.
   * @param params Route parameters containing the GameSessionSchedule ID.
   * @returns The updated {@link GameSessionSchedule} document, otherwise an appropriate error response.
   */
  @Security("jwt", ["admin"])
  static async PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const parsedBody = UpdateGameSessionScheduleRequestSchema.parse(await req.json())
      const gameSessionDataService = new GameSessionDataService()
      const updatedGameSessionSchedule = await gameSessionDataService.updateGameSessionSchedule(
        (await params).id,
        parsedBody,
      )
      return NextResponse.json({ data: updatedGameSessionSchedule }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request body", details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      if (error instanceof NotFound) {
        return NextResponse.json(
          { error: "Game session schedule not found" },
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
   * DELETE method to delete a game session schedule.
   *
   * @param req The request object
   * @param params Route parameters containing the GameSessionSchedule ID
   * @returns No content status code
   */
  @Security("jwt", ["admin"])
  static async DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const cascade = req.nextUrl.searchParams.get("cascade") === "true"
      const gameSessionDataService = new GameSessionDataService()
      const transactionID = await RouteWrapper.getTransactionId(!!cascade)

      if (transactionID) {
        try {
          const { docs } = await payload.find({
            collection: "gameSession",
            where: {
              gameSessionSchedule: {
                equals: id,
              },
            },
          })
          const gameSession = docs[0]
          await gameSessionDataService.deleteGameSessionSchedule(id)
          await gameSessionDataService.deleteGameSession(gameSession.id)
          await RouteWrapper.deleteRelatedBookingsForSession(gameSession.id, transactionID)
          if (transactionID) {
            await payload.db.commitTransaction(transactionID)
          }
        } catch {
          if (transactionID) {
            await payload.db.rollbackTransaction(transactionID)
          }
        }
      } else {
        await gameSessionDataService.deleteGameSessionSchedule(id)
      }

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json(
          { error: "Game session schedule not found" },
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
   * Retrieves a transaction ID for cascading deletes if related bookings should be deleted.
   * @param shouldDeleteRelated indicates whether related bookings should be deleted
   * @private
   *
   * @remarks it should be noted that this method will return undefined if the `deleteRelatedBookings` parameter is false or if transaction support is not enabled in Payload.
   */
  private static async getTransactionId(
    shouldDeleteRelated: boolean,
  ): Promise<string | number | undefined> {
    if (!shouldDeleteRelated) return undefined
    return (await payload.db.beginTransaction()) ?? undefined
  }

  /**
   * Deletes all bookings related to a game session.
   * @param sessionId the ID of the game session whose bookings are to be deleted
   * @param transactionID an optional transaction ID for the request, useful for tracing
   * @private
   */
  private static async deleteRelatedBookingsForSession(
    sessionId: string,
    transactionID?: string | number,
  ): Promise<void> {
    const bookingDataService = new BookingDataService()
    const relatedBookings = await bookingDataService.getBookingsBySessionId(sessionId)
    const relatedBookingIds = relatedBookings.map((booking) => booking.id)
    await bookingDataService.deleteBookings(relatedBookingIds, transactionID)
  }
}

export const { GET, PATCH, DELETE } = RouteWrapper
