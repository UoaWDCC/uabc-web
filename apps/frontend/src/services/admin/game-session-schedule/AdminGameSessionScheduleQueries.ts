import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminGameSessionScheduleService from "./AdminGameSessionScheduleService"

/**
 * Retrieves and caches paginated game session schedules.
 *
 * @param query The pagination query parameters.
 * @returns A query hook that fetches a page of game session schedules.
 */
export const useGetPaginatedGameSessionSchedules = (query: PaginationQuery) => {
  const { token } = useAuth()
  return useInfiniteQuery({
    queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await AdminGameSessionScheduleService.getPaginatedGameSessionSchedules({
        ...query,
        page: pageParam,
        token,
      })
      return response
    },
    getNextPageParam: (lastPage) => lastPage.data?.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.data?.prevPage,
  })
}
