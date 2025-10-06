import { BookingQuerySchema, BookingQueryType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import BookingDataService from "@/data-layer/services/BookingDataService"

class RouteWrapper {
  @Security("jwt")
  static async GET(req: NextRequest & { user: User }) {
    try {
      const bookingDataService = new BookingDataService()
      const type = req.nextUrl.searchParams.get("type") || BookingQueryType.ALL
      const result = BookingQuerySchema.safeParse({ type })

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid query parameters", details: "Invalid query type provided" },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const bookings = await bookingDataService.getAllBookingsByUserId(
        req.user.id,
        result.data.type,
      )
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

export const { GET } = RouteWrapper
