"use client"
import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import BookingService from "./BookingService"

/**
 * Custom hook to fetch the current user's bookings and cache result using Tanstack Query
 *
 * @returns A query hook that fetches bookings data
 */
export function useMyBookings() {
  return useQuery({
    queryKey: [QueryKeys.BOOKINGS_QUERY_KEY, QueryKeys.MY_BOOKINGS_QUERY_KEY],
    queryFn: async () => {
      return await BookingService.getMyBookings()
    },
  })
}
