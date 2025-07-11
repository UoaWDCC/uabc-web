import { CreateGameSessionScheduleRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import { GameSessionSchedule } from "@/data-layer/collections/GameSessionSchedule"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class GameSessionSchedulesRouteWrapper {
  /**
   * POST Method to create a new game session schedule.
   *
   * @param req The request object containing the request body.
   * @returns The created {@link GameSessionSchedule} document, otherwise an appropriate error response.
   */
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    try {
      const parsedBody = CreateGameSessionScheduleRequestSchema.parse(await req.json())
      const gameSessionDataService = new GameSessionDataService()
      const newGameSessionSchedule =
        await gameSessionDataService.createGameSessionSchedule(parsedBody)
      return NextResponse.json({ data: newGameSessionSchedule }, { status: StatusCodes.CREATED })
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

export const { POST } = GameSessionSchedulesRouteWrapper
