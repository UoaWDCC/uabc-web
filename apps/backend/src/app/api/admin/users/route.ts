import { CreateUserRequestSchema, PaginationQuerySchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
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
      const result = PaginationQuerySchema.safeParse({
        limit: searchParams.get("limit") ?? 10,
        page: searchParams.get("page") ?? 1,
        query: searchParams.get("query") || undefined,
      })
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid query parameters", details: result.error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const { limit, page, query } = result.data

      const userDataService = new UserDataService()
      const paginatedUsers = await userDataService.getPaginatedUsers({ limit, page, query })

      return NextResponse.json({ data: paginatedUsers })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * POST Method to create a new user.
   *
   * @param req The request object containing the request body
   * @returns The created {@link User} document.
   */
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    try {
      const parsedBody = CreateUserRequestSchema.parse(await req.json())
      const userDataService = new UserDataService()
      const newUser = await userDataService.createUser(parsedBody)

      return NextResponse.json({ data: newUser }, { status: StatusCodes.CREATED })
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

export const { GET, POST } = UsersRouteWrapper
