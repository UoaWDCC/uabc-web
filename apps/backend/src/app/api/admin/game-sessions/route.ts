import { CreateGameSessionRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class GameSessionRouteWrapper {
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    try {
      const parsedBody = CreateGameSessionRequestSchema.parse(await req.json())
      const gameSessionDataService = new GameSessionDataService()
      const newGameSession = await gameSessionDataService.createGameSession(parsedBody)

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
