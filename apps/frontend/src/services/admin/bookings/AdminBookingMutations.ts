import type { UpdateBookingRequest } from "@repo/shared/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminBookingService from "./AdminBookingService"

/**
 * Provides a mutation hook for updating a booking and invalidates the booking query cache.
 *
 * @returns A mutation hook that updates a booking.
 */
export const useDeleteBooking = () => {
  const queryClient = useQueryClient()
  useMutation({
    mutationFn: AdminBookingService.deleteBooking,
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
