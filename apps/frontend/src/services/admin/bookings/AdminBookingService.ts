import { DeleteResponseSchema, UpdateBookingRequestSchema } from "@repo/shared/schemas"
import type { UpdateBookingRequest } from "@repo/shared/types/booking"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminBookingService = {
  /**
   * Deletes a booking by ID.
   *
   * @param params.bookingId The ID of the booking to delete.
   * @param params.token The auth token to use for the request (may be null).
   * @returns A promise that resolves to the delete response.
   * @throws An error if the deletion fails.
   */
  deleteBooking: async ({ bookingId, token }: { bookingId: string; token: string | null }) => {
    const response = await apiClient.delete(
      `/api/admin/bookings/${bookingId}`,
      DeleteResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Updates an existing booking.
   *
   * @param params.bookingId The ID of the booking to update.
   * @param params.data The updated booking data.
   * @param params.token The auth token to use for the request (may be null).
   * @returns A promise that resolves to the updated booking.
   * @throws An error if the update fails.
   */
  updateBooking: async ({
    bookingId,
    data,
    token,
  }: {
    bookingId: string
    data: UpdateBookingRequest
    token: string | null
  }) => {
    const response = await apiClient.patch(
      `/api/admin/bookings/${bookingId}`,
      data,
      UpdateBookingRequestSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminBookingService
