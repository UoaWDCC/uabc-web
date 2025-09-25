import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

class MembershipsWrapper {
  @Security("jwt", ["admin"])
  static async PATCH(_req: NextRequest) {
    const userDataService = new UserDataService()

    try {
      await userDataService.resetAllMemberships()

      return NextResponse.json({ status: StatusCodes.NO_CONTENT })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { PATCH } = MembershipsWrapper
