import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { Security } from "@/business-layer/middleware/Security"
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
      const gameSessionDataService = new GameSessionDataService()
      await gameSessionDataService.deleteGameSession(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
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

export const DELETE = GameSessionRouteWrapper.DELETE
