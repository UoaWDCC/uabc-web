import type { PaginationQuery } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminGameSessionScheduleService from "./AdminGameSessionScheduleService"

const AdminGameSessionScheduleQuery = {
  /**
   * Retrieves and caches paginated game session schedules.
   *
   * @param query The pagination query parameters.
   * @returns A query hook that fetches all game session schedules.
   */
  useGetAllGameSessionSchedules: (query: PaginationQuery) => {
    return useQuery({
      queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      queryFn: async () => {
        const response = await AdminGameSessionScheduleService.getAllGameSessionSchedules(query)
        return response?.data ?? []
      },
    })
  },
} as const

export default AdminGameSessionScheduleQuery
