import { Security } from "@/business-layer/middleware/Security"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import type { CreateSemesterData } from "@repo/shared"
import { CreateSemesterRequestBody } from "@repo/shared"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

class SemesterRouteWrapper {
  /**
   * POST Method to create a new semester.
   *
   * @param req The request object containing the request body
   * @returns The created semester.
   */
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    try {
      const parsedBody = CreateSemesterRequestBody.parse(await req.json())
      const semesterDataService = new SemesterDataService()
      const newSemester = await semesterDataService.createSemester(parsedBody as CreateSemesterData)

      return NextResponse.json({ data: newSemester }, { status: StatusCodes.CREATED })
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

export const POST = SemesterRouteWrapper.POST
