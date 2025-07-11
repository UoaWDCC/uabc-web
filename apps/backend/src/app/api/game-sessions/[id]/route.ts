import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class GameSessionRouteWrapper {
  /**
   * GET method to fetch a single GameSession by ID.
   *
   * @param req The request object
   * @param params The route parameters containing the GameSession ID
   * @returns The GameSession data if found, otherwise appropriate error response
   */
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const gameSessionDataService = new GameSessionDataService()
      const gameSession = await gameSessionDataService.getGameSessionById(id)

      return NextResponse.json({ data: gameSession }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json(
          { error: "Game Session not found" },
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

export const GET = GameSessionRouteWrapper.GET
