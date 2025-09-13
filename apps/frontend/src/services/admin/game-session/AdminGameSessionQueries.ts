import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminGameSessionService from "./AdminGameSessionService"

export const useGetAllGameSessionBookings = (id: string) => {
  const { token } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.BOOKINGS_QUERY_KEY, QueryKeys.GAME_SESSION_QUERY_KEY, id],
    queryFn: () => AdminGameSessionService.getAllGameSessionBookings(id, token),
    enabled: !!token && !!id,
  })
}
