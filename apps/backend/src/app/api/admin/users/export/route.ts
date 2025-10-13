import { UserIdListQuerySchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

class ExportRouteWrapper {
  /**
   * GET method to fetch list of users being searched for
   *
   * @param req The request object containing user IDs
   * @returns List of users
   */
  @Security("jwt", ["admin"])
  static async GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)

      const result = UserIdListQuerySchema.safeParse(searchParams.getAll("id"))
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid query parameters", details: result.error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const userDataService = new UserDataService()
      const users = await userDataService.getUsersByIds(result.data)

      return NextResponse.json({ data: users })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { GET } = ExportRouteWrapper
