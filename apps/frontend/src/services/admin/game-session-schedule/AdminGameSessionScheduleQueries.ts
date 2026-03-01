import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
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
    enabled: !!token,
  })
}

/**
 * Retrieves and caches game session schedules for a specific semester.
 * Only fetches when enabled is true, enabling lazy/on-demand loading.
 *
 * @param semesterId The semester ID to fetch schedules for.
 * @param enabled Whether the query should run.
 * @returns A query hook that fetches game session schedules for the semester.
 */
export const useGetGameSessionSchedulesBySemester = (semesterId: string, enabled: boolean) => {
  const { token } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY, semesterId],
    queryFn: async () => {
      const response = await AdminGameSessionScheduleService.getGameSessionSchedulesBySemester({
        semesterId,
        token,
      })
      return response
    },
    enabled: !!token && enabled,
  })
}
