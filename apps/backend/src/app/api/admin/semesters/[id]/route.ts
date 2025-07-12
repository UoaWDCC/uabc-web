import { UpdateSemesterRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

class SemesterRouteWrapper {
  /**
   * DELETE method to delete a semester.
   *
   * @param req The request object containing the request body
   * @returns No content status code
   */
  @Security("jwt", ["admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const semesterDataService = new SemesterDataService()
      await semesterDataService.deleteSemester(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
  /**
   * PATCH method to update a semester.
   *
   * @param req The request object containing the request body
   * @param params The route parameters containing the Semester ID
   * @returns The updated {@link Semester} document
   */
  @Security("jwt", ["admin"])
  static async PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const parsedBody = UpdateSemesterRequestSchema.parse(await req.json())
      const semesterDataService = new SemesterDataService()
      const updatedSemester = await semesterDataService.updateSemester(id, parsedBody)
      return NextResponse.json({ data: updatedSemester }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
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
}

export const { DELETE, PATCH } = SemesterRouteWrapper
