import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
})

class UsersRouteWrapper {
  /**
   * GET method to fetch paginated users.
   *
   * @param req The request object containing query parameters for pagination
   * @returns Paginated user data with proper metadata
   */
  @Security("jwt", ["admin"])
  static async GET(req: NextRequest) {
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
      const userDataService = new UserDataService()
      const paginatedUsers = await userDataService.getPaginatedUsers(limit, page)
      return NextResponse.json({ data: paginatedUsers }, { status: StatusCodes.OK })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = UsersRouteWrapper.GET
