// Cascade deletion of Semester to related documents
// ensure proper route security
// TODO: add testing!
// 1-to-many relationship!
// https://payloadcms.com/docs/database/transactions

import { UpdateSemesterRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import { payload } from "@/data-layer/adapters/Payload"
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

    const deletedRelatedDocs = req.nextUrl.searchParams.get("deleteRelatedDocs") === "true"
    const cascadeTransactionId = await SemesterRouteWrapper.getTransactionId(!!deletedRelatedDocs)

    try {
      const semesterDataService = new SemesterDataService()
      if (deletedRelatedDocs) {
        await semesterDataService.deleteRelatedGameSchedulesForSemester(id, cascadeTransactionId)
      }
      await semesterDataService.deleteSemester(id, cascadeTransactionId)

      if (cascadeTransactionId) {
        await payload.db.commitTransaction(cascadeTransactionId)
      }

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (cascadeTransactionId) {
        await payload.db.rollbackTransaction(cascadeTransactionId)
      }
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  // NB: this function may be moved elsewhere later for reusability
  /**
   * Retrieves a transaction ID for cascading deletes if related bookings should be deleted.
   * @param shouldDeleteRelated indicates whether related bookings should be deleted
   * @private
   *
   * @remarks it should be noted that this method will return undefined if the `deleteRelatedBookings` parameter is false or if transaction support is not enabled in Payload.
   */
  private static async getTransactionId(
    shouldDeleteRelated: boolean,
  ): Promise<string | number | undefined> {
    if (!shouldDeleteRelated) return undefined
    return (await payload.db.beginTransaction()) ?? undefined
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
