import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminGameSessionScheduleService from "./AdminGameSessionScheduleService"

const AdminGameSessionScheduleQuery = {
  /**
   * Retrieves and caches paginated game session schedules.
   *
   * @param query The pagination query parameters.
   * @returns A query hook that fetches all game session schedules.
   */
  useGetPaginatedGameSessionSchedules: (query: PaginationQuery) => {
    return useInfiniteQuery({
      queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const response = await AdminGameSessionScheduleService.getAllPaginatedGameSessionSchedules({
          ...query,
          page: pageParam,
        })
        return response
      },
      getNextPageParam: (lastPage) => lastPage?.data?.nextPage,
      getPreviousPageParam: (firstPage) => firstPage?.data?.prevPage,
    })
  },
} as const

export default AdminGameSessionScheduleQuery
