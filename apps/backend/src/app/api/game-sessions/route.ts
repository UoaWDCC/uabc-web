import { QuerySchema } from "@repo/shared"
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
    const result = QuerySchema.safeParse({
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
    return NextResponse.json({ data: paginatedGameSessions })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
