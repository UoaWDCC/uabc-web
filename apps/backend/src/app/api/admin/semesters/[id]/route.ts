// write test cases for transaction.ts
import { UpdateSemesterRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import {
  commitCascadeTransaction,
  createTransactionId,
  rollbackCascadeTransaction,
} from "@/data-layer/adapters/Transaction"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

class SemesterRouteWrapper {
  /**
   * DELETE method to delete a semester.
   *
   * @param req The request object containing the request body
   * @returns No content status code
   */
  @Security("jwt", ["admin"])
  static async DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let cascadeTransactionId: string | number | undefined
    const deleteRelatedDocs = req.nextUrl.searchParams.get("deleteRelatedDocs") !== "false"

    try {
      const semesterDataService = new SemesterDataService()
      const gameSessionDataService = new GameSessionDataService()
      const bookingDataService = new BookingDataService()

      // check if semester exists, otherwise throw notfound error
      await semesterDataService.getSemesterById(id)

      if (deleteRelatedDocs) {
        cascadeTransactionId = await createTransactionId()

        await bookingDataService.deleteBookingsBySemesterId(id, cascadeTransactionId)
        await gameSessionDataService.deleteAllGameSessionsBySemesterId(id, cascadeTransactionId)
        await gameSessionDataService.deleteAllGameSessionSchedulesBySemesterId(
          id,
          cascadeTransactionId,
        )
      }

      await semesterDataService.deleteSemester(id, cascadeTransactionId)

      await commitCascadeTransaction(cascadeTransactionId)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      await rollbackCascadeTransaction(cascadeTransactionId)

      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
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
