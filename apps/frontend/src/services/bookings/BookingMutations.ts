import { type CreateBookingRequest, TimeframeFilter, type UpdateBookingRequest } from "@repo/shared"
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
      return BookingService.createBooking(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BOOKINGS_QUERY_KEY],
      })
      // Need to reset current sessions to avoid slow update for bookable sessions
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY, TimeframeFilter.CURRENT],
      })
      // When a user creates bookings, their profile needs to be fetched again to show correct session credit
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AUTH, QueryKeys.ME] })
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
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: UpdateBookingRequest }) =>
      BookingService.updateBooking({ bookingId, data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BOOKINGS_QUERY_KEY],
      })
    },
  })
}
