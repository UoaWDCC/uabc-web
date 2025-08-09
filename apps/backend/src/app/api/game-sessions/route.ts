import { PaginationQuerySchema } from "@repo/shared"
import type { GameSessionSchedule } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"

/**
 * GET method to fetch paginated game sessions.
 *
 * @param req The request object containing query parameters for pagination
 * @returns Paginated game sessions data
 */
export const GET = async (req: NextRequest) => {
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
    const gameSemesterDataService = new GameSessionDataService()
    const paginatedGameSessions = await gameSemesterDataService.getPaginatedGameSessions(
      limit,
      page,
    )
    /**
     * Normalise the `location` and `name` fields to use their parent {@link GameSessionSchedule} data
     */
    for (let i = 0; i < paginatedGameSessions.docs.length; i++) {
      const gameSession = paginatedGameSessions.docs[i]
      if (typeof gameSession.gameSessionSchedule === "object") {
        gameSession.location = (gameSession.gameSessionSchedule as GameSessionSchedule).location
        gameSession.name = (gameSession.gameSessionSchedule as GameSessionSchedule).name
      }
    }
    return NextResponse.json({ data: paginatedGameSessions })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
