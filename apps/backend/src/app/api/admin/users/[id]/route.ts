import { UpdateUserRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

class UserRouteWrapper {
  /**
   * GET method to fetch a single user by ID.
   *
   * @param _req The request object
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

  /**
   * PATCH method to update a user.
   *
   * @param req The request object containing the request body
   * @param params The route parameters containing the User ID
   * @returns The updated User document
   */
  @Security("jwt", ["admin"])
  static async PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const parsedBody = UpdateUserRequestSchema.parse(await req.json())
      const userDataService = new UserDataService()
      const updatedUser = await userDataService.updateUser(id, parsedBody)
      return NextResponse.json({ data: updatedUser }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "User not found" }, { status: StatusCodes.NOT_FOUND })
      }
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

  /**
   * DELETE method to delete a single user by ID.
   *
   * @param _req The request object
   * @param params The route parameters containing the user ID
   * @returns No content response if successful, otherwise appropriate error response
   */
  @Security("jwt", ["admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const userDataService = new UserDataService()
      await userDataService.deleteUser(id)

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
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

export const { GET, DELETE, PATCH } = UserRouteWrapper
