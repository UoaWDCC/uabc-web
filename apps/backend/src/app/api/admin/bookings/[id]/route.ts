import { UpdateBookingRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"

class BookingsRouteWrapper {
  /**
   * PATCH Method to update a booking.
   *
   * @param req The request object containing the request body.
   * @param params Route parameters containing the Booking ID.
   * @returns The updated {@link Booking} document, otherwise an appropriate error response.
   */
  @Security("jwt", ["admin"])
  static async PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const parsedBody = UpdateBookingRequestSchema.parse(await req.json())
      const bookingDataService = new BookingDataService()
      const updatedBooking = await bookingDataService.updateBooking((await params).id, parsedBody)
      return NextResponse.json({ data: updatedBooking }, { status: StatusCodes.OK })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request body", details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Booking not found" }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * DELETE method to delete a booking
   *
   * @param _req the request object
   * @returns a no content response if successful
   */
  @Security("jwt", ["admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const bookingDataService = new BookingDataService()
      await bookingDataService.deleteBooking(id)

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "No booking found" }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { PATCH, DELETE } = BookingsRouteWrapper
