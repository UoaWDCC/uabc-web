import type { UpdateBookingRequest } from "@repo/shared/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminBookingService from "./AdminBookingService"

/**
 * Provides a mutation hook for deleting a booking and invalidates the booking query cache.
 *
 * @returns A mutation hook that deletes a booking.
 */
export const useDeleteBooking = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (bookingId: string) => {
      if (!token) {
        throw new Error("No token provided")
      }
      return AdminBookingService.deleteBooking(bookingId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BOOKINGS_QUERY_KEY],
      })
    },
  })
}

/**
 * Provides a mutation hook for updating a booking and invalidates the booking query cache.
 *
 * @returns A mutation hook that updates a booking.
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: UpdateBookingRequest }) =>
      AdminBookingService.updateBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BOOKINGS_QUERY_KEY],
      })
    },
  })
}
