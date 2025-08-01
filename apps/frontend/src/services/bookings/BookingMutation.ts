import type { CreateBookingRequest } from "@repo/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import BookingService from "./BookingService"

/**
 * Provides a mutation hook for creating a new booking and invalidates related query caches.
 *
 * @returns A mutation hook that creates a booking.
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => {
      if (!token) {
        throw new Error("No token provided")
      }
      return BookingService.createBooking(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MY_BOOKINGS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      })
    },
  })
}
