import { ApiClient, apiClient } from "@/lib/api/client"

const AdminBookingService = {
  /**
   * Deletes a booking by ID.
   *
   * @param bookingId The ID of the booking to delete.
   * @returns A promise that resolves to a boolean indicating success.
   * @throws An error if the deletion fails.
   */
  deleteBooking: async (bookingId: string) => {
    const response = await apiClient.delete(`/api/admin/bookings/${bookingId}`)
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminBookingService
