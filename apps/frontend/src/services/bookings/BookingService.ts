import {
  type CreateBookingRequest,
  CreateBookingResponseSchema,
  GetBookingsResponseSchema,
} from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

/**
 * Service for managing booking data.
 */
const BookingService = {
  /**
   * Retrieves bookings for the current user from the API.
   *
   * @returns A promise that resolves to an array of Booking objects.
   * @throws When the API request fails
   */
  getMyBookings: async (token: string | null) => {
    const response = await apiClient.get("/api/me/bookings", GetBookingsResponseSchema, {
      requiresAuth: true,
      token: token,
    })
    return ApiClient.throwIfError(response)
  },

  /**
   * Creates a new booking.
   *
   * @param data The booking data to create.
   * @returns A promise that resolves to the created booking.
   */
  createBooking: async (data: CreateBookingRequest, token: string | null) => {
    const response = await apiClient.post("/api/bookings", data, CreateBookingResponseSchema, {
      requiresAuth: true,
      token: token,
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default BookingService
