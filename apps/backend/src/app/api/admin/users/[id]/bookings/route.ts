// Need an endpoint for admins to fetch a specific users bookings

import { Security } from "@/business-layer/middleware/Security";
import BookingDataService from "@/data-layer/services/BookingDataService";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { NotFound, User } from "payload";

class BookingsRouteWrapper {
    /**
     * GET method to fetch bookings for a specific user
     * 
     * @param req the request object
     * @param params route parameters with the userID
     * @returns the user's bookings if found, otherwise error response
     */
    @Security ("jwt", ["admin"])
    static async GET(req: NextRequest, { params }: { params: Promise<{id: string }>}) {
        try {
            // getting the id value of the params and putting it into the variable id
            const { id } = await params;
            const bookingDataService = new BookingDataService()
            const bookings = await bookingDataService.getAllBookingsByUserId(id)

            return NextResponse.json({ data: bookings})

        } catch (error) {
            console.error(error)
            return NextResponse.json(
                { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
                { status: StatusCodes.INTERNAL_SERVER_ERROR },
            )
        }
    }    
}