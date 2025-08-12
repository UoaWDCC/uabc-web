import type { CreateBookingRequest } from "@repo/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import BookingService from "./BookingService"

/**
 * Provides a mutation hook for creating a new booking and invalidates related query caches.
 *
 * @returns A mutation hook that creates a booking.
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => {
      return BookingService.createBooking(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MY_BOOKINGS_QUERY_KEY],
      })
    },
  })
}
