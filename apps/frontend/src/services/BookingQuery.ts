"use client"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { getMyBookings } from "./BookingService"
import { QueryKeys } from "./index"

/**
 * Custom hook to fetch the current user's bookings and cache result using Tanstack Query
 *
 * @returns A query hook that fetches bookings data
 */
export function useMyBookings() {
  const { token } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.MY_BOOKINGS_QUERY_KEY],
    queryFn: () => getMyBookings(token ?? ""),
  })
}
