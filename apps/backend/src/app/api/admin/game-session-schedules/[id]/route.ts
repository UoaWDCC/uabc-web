import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { Security } from "@/business-layer/middleware/Security"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

class RouteWrapper {
  /**
   * GET method to fetch a game session schedule.
   *
   * @param _req The request object
   * @param params route parameters containing the GameSessionSchedule ID
   * @returns No content status code
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
   * DELETE method to delete a game session schedule.
   *
   * @param _req The request object
   * @param params route parameters containing the GameSessionSchedule ID
   * @returns No content status code
   */
  @Security("jwt", ["admin"])
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

export const { GET, DELETE } = RouteWrapper
