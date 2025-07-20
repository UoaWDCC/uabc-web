import { UpdateUserRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import { payload } from "@/data-layer/adapters/Payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
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
  static async DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string; deleteRelatedBookings?: boolean }> },
  ) {
    const { id, deleteRelatedBookings } = await params

    // This will only be undefined if deleteRelatedBookings is false OR transaction support is not enabled
    const cascadeDeleteTransactionID = await UserRouteWrapper.getTransactionId(
      !!deleteRelatedBookings,
    )

    try {
      const userDataService = new UserDataService()
      if (deleteRelatedBookings) {
        await UserRouteWrapper.deleteRelatedBookingsForUser(id, cascadeDeleteTransactionID)
      }
      await userDataService.deleteUser(id, cascadeDeleteTransactionID)

      // If deleteRelatedBookings delete was initiated, commit the transaction
      if (cascadeDeleteTransactionID) await payload.db.commitTransaction(cascadeDeleteTransactionID)

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (cascadeDeleteTransactionID) {
        await payload.db.rollbackTransaction(cascadeDeleteTransactionID)
      }
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
   * Deletes all bookings related to a user.
   * @param userId the ID of the user whose bookings are to be deleted
   * @param transactionID an optional transaction ID for the request, useful for tracing
   * @private
   */
  private static async deleteRelatedBookingsForUser(
    userId: string,
    transactionID?: string | number,
  ): Promise<void> {
    const bookingDataService = new BookingDataService()
    // relatedBookings may be paginated, so we need to fetch all of them
    let relatedBookings = await bookingDataService.getBookingsByUserId(userId, transactionID)

    const relatedBookingIds = relatedBookings.docs.map((booking) => booking.id)

    // Check if there are more pages of bookings for the user
    while (relatedBookings.hasNextPage) {
      relatedBookings = await bookingDataService.getBookingsByUserId(
        userId,
        transactionID,
        100,
        relatedBookings.nextPage || undefined,
      )
      // IMPORTANT: this must come after the previous line, to avoid repeating the same bookings
      relatedBookingIds.push(...relatedBookings.docs.map((booking) => booking.id))
    }
    await bookingDataService.deleteBookings(relatedBookingIds, transactionID)
  }
}

export const { GET, DELETE, PATCH } = UserRouteWrapper
