import { BookingSchema as BaseBookingSchema } from "@repo/shared"
import type { Booking } from "@repo/shared/payload-types"
import { z } from "zod"
import { apiClient } from "../lib/api/client"

const BookingSchema = BaseBookingSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
})

/**
 * Retrieves bookings for the current user from the API.
 *
 * @returns A promise that resolves to an array of Booking objects.
 * @throws When the API request fails
 */
export const getMyBookings = async (token: string): Promise<Booking[]> => {
  const response = await apiClient.get<{ data: Booking[] }>(
    "/api/me/bookings",
    z.object({ data: z.array(BookingSchema) }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.success) {
    throw response.error ?? new Error("Failed to fetch bookings")
  }
  return response.data.data
}
