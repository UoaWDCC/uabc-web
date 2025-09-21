import { CreateGameSessionRequestSchema, getGameSessionOpenDay } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import type { GameSession } from "@/data-layer/collections/GameSession"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

class GameSessionRouteWrapper {
  /**
   * POST Method to create a new game session.
   *
   * @param req The request object containing the request body.
   * @returns The created {@link GameSession} document.
   */
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    const gameSessionDataService = new GameSessionDataService()
    const semesterDataService = new SemesterDataService()

    try {
      const parsedBody = CreateGameSessionRequestSchema.parse(await req.json())
      const semester =
        typeof parsedBody.semester === "string"
          ? await semesterDataService.getSemesterById(parsedBody.semester)
          : parsedBody.semester

      const newGameSession = await gameSessionDataService.createGameSession({
        ...parsedBody,
        openTime: getGameSessionOpenDay(semester, new Date(parsedBody.startTime)).toISOString(),
      })

      return NextResponse.json({ data: newGameSession }, { status: StatusCodes.CREATED })
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

export const POST = GameSessionRouteWrapper.POST
