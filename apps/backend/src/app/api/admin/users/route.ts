import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

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

      const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 10))
      const page = Math.max(1, Number(searchParams.get("page")) || 1)

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
