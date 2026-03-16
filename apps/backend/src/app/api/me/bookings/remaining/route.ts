import type { RequestWithUser } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { getRemainingSessions } from "@/data-layer/utils/GameSessionUtils"

class RouteWrapper {
  @Security("jwt")
  static async GET(req: RequestWithUser) {
    try {
      return NextResponse.json({
        data: {
          remainingSessions: await getRemainingSessions(
            req.user,
            new SemesterDataService(),
            new BookingDataService(),
            new UserDataService(),
          ),
        },
      })
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
