import { CreateGameSessionScheduleRequestSchema, PaginationQuerySchema } from "@repo/shared"
import type { GameSession } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import { GameSessionSchedule } from "@/data-layer/collections/GameSessionSchedule"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class GameSessionSchedulesRouteWrapper {
  /**
   * GET Method to get paginated game session schedules.
   *
   * @param req The request object containing the request body.
   * @returns All {@link GameSessionSchedule} documents, otherwise an appropriate error response.
   */
  @Security("jwt", ["admin"])
  static async GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const result = PaginationQuerySchema.safeParse({
        limit: searchParams.get("limit") ?? 10,
        page: searchParams.get("page") ?? 1,
      })
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid query parameters", details: result.error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      const { limit, page } = result.data
      const gameSessionDataService = new GameSessionDataService()
      const paginatedSchedules = await gameSessionDataService.getPaginatedGameSessionSchedules(
        limit,
        page,
      )
      return NextResponse.json({ data: paginatedSchedules })
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

  /**
   * POST Method to create a new game session schedule and defaults cascade creation of game sessions).
   *
   * @param req The request object containing the request body.
   * @returns The created {@link GameSessionSchedule} document and array of {@link GameSession}, otherwise an appropriate error response.
   */
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    const cascadeDisabled = req.nextUrl.searchParams.get("cascadeDisabled") === "true"

    try {
      const parsedBody = CreateGameSessionScheduleRequestSchema.parse(await req.json())
      const gameSessionDataService = new GameSessionDataService()
      const newGameSessionSchedule =
        await gameSessionDataService.createGameSessionSchedule(parsedBody)

      if (!cascadeDisabled) {
        await gameSessionDataService.cascadeCreateGameSessions(newGameSessionSchedule)
      }
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

export const { GET, POST } = GameSessionSchedulesRouteWrapper
