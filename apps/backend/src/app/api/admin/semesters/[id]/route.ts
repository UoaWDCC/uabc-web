import { Security } from "@/business-layer/middleware/Security"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"

import SemesterDataService from "@/data-layer/services/SemesterDataService"

class SemesterRouteWrapper {
  /**
DELETE method to delete a semester.*,
@param req The request object containing the request body,
@returns No content status code*/
  @Security("jwt", ["admin"])
  public static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const semesterDataService = new SemesterDataService()
      await semesterDataService.deleteSemester(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR), {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })
    }
  }
}
export const DELETE = SemesterRouteWrapper.DELETE
