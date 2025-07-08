import type { User } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

class RouteWrapper {
  @Security("jwt")
  static async GET(req: NextRequest & { user: User }) {
    try {
      const userDataService = new UserDataService()

      const userData = await userDataService.getUserById(req.user.id)

      return NextResponse.json({ data: userData })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { GET } = RouteWrapper
