import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

class UserRouteWrapper {
  /**
   * GET method to fetch a single user by ID.
   *
   * @param req The request object
   * @param params The route parameters containing the user ID
   * @returns The user data if found, otherwise appropriate error response
   */
  @Security("jwt", ["admin"])
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const userDataService = new UserDataService()
      const user = await userDataService.getUserById(id)

      return NextResponse.json({ data: user }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "User not found" }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = UserRouteWrapper.GET
