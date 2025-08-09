import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminGameSessionService from "./AdminGameSessionService"

export const useGetAllGameSessionBookings = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.BOOKINGS_QUERY_KEY, QueryKeys.GAME_SESSION_QUERY_KEY, id],
    queryFn: () => AdminGameSessionService.getAllGameSessionBookings(id),
  })
}
