import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"

class BookingsRouteWrapper {
  /**
   * GET method to fetch bookings for a specific user
   *
   * @param _req the request object
   * @param params route parameters with the userId
   * @returns the user's bookings if found, otherwise error response
   */
  @Security("jwt", ["admin"])
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const bookingDataService = new BookingDataService()
      const bookings = await bookingDataService.getAllBookingsByUserId(id)

      return NextResponse.json({ data: bookings })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * DELETE method to delete bookings for a specific user
   *
   * @param _req the request object
   * @param params route parameters with the userId
   * @returns a no content response if successful
   */
  @Security("jwt", ["admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const bookingDataService = new BookingDataService()
      await bookingDataService.deleteBookingsByUserId(id)

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

export const { GET, DELETE } = BookingsRouteWrapper
