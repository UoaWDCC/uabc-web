import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"

class BookingsRouteWrapper {
  /**
   * GET method to fetch bookings for a certain GameSession
   *
   * @param _req the request object
   * @param params route parameters with the GameSession ID
   * @returns the GameSession's bookings if found, otherwise error response
   */
  @Security("jwt", ["admin"])
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const bookingDataService = new BookingDataService()
      const bookings = await bookingDataService.getAllBookingsBySessionId(id)

      return NextResponse.json({ data: bookings })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { GET } = BookingsRouteWrapper
