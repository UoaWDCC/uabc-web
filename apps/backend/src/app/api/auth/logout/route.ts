import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"

class RouteWrapper {
  @Security("jwt")
  public static async POST(_req: NextRequest) {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: StatusCodes.OK,
      },
    )
    response.cookies.delete(AUTH_COOKIE_NAME)

    return response
  }
}

export const { POST } = RouteWrapper
