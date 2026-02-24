import { type RequestWithUser, UpdateSelfRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

class RouteWrapper {
  @Security("jwt")
  static async GET(req: RequestWithUser) {
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

  @Security("jwt")
  static async PATCH(req: RequestWithUser) {
    try {
      const parsedBody = UpdateSelfRequestSchema.parse(await req.json())

      const userDataService = new UserDataService()
      const updatedUser = await userDataService.updateUser(req.user.id, parsedBody)
      return NextResponse.json({ data: updatedUser }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request body", details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { GET, PATCH } = RouteWrapper
