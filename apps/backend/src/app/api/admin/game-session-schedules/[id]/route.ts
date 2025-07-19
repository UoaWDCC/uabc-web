import { UpdateGameSessionScheduleRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class RouteWrapper {
  /**
   * GET method to fetch a game session schedule.
   *
   * @param _req The request object
   * @param params route parameters containing the GameSessionSchedule ID
   * @returns OK code and the game session schedule data
   */
  @Security("jwt", ["Admin"])
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
  @Security("jwt", ["Admin"])
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
   * @param _req The request object
   * @param params Route parameters containing the GameSessionSchedule ID
   * @returns No content status code
   */
  @Security("jwt", ["Admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const gameSessionDataService = new GameSessionDataService()
      await gameSessionDataService.deleteGameSessionSchedule(id)
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
}

export const { GET, PATCH, DELETE } = RouteWrapper
