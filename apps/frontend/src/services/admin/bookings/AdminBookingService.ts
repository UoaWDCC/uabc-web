import { BookingSchema, DeleteResponseSchema } from "@repo/shared/schemas"
import type { UpdateBookingRequest } from "@repo/shared/types/booking"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminBookingService = {
  /**
   * Deletes a booking by ID.
   *
   * @param bookingId The ID of the booking to delete.
   * @param token The user's authentication token.
   * @returns A promise that resolves to a boolean indicating success.
   * @throws An error if the deletion fails.
   */
  deleteBooking: async (bookingId: string, token: string) => {
    if (!token) {
      throw new Error("No token provided")
    }
    const response = await apiClient.delete(
      `/api/admin/bookings/${bookingId}`,
      DeleteResponseSchema,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Updates an existing booking.
   *
   * @param bookingId The ID of the booking to update.
   * @param data The updated booking data.
   * @returns A promise that resolves to the updated booking.
   * @throws An error if the update fails.
   */
  updateBooking: async (bookingId: string, data: UpdateBookingRequest) => {
    const response = await apiClient.patch(`/api/admin/bookings/${bookingId}`, data, BookingSchema)
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminBookingService
