import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"

class RouteWrapper {
  @Security("jwt")
  public static async POST(_req: NextRequest) {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)

    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: StatusCodes.OK,
      },
    )
  }
}

export const { POST } = RouteWrapper
