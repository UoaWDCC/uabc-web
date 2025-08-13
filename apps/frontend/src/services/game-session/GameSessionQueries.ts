import type { GameSessionTimeframe, PaginationQuery } from "@repo/shared"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import GameSessionService from "./GameSessionService"

/**
 * Retrieves and caches paginated game sessions.
 *
 * @param query The pagination query parameters.
 * @returns A query hook that fetches a page of game sessions.
 */
export const useGetPaginatedGameSessions = (query: PaginationQuery) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await GameSessionService.getPaginatedGameSessions({
        ...query,
        page: pageParam,
      })
      return response
    },
    getNextPageParam: (lastPage) => lastPage.data?.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.data?.prevPage,
  })
}

/**
 * Retrieves and caches all game sessions for a specific semester.
 *
 * @param id The ID of the semester to retrieve game sessions for.
 * @param sessionTimeFrame Optional timeframe for filtering game sessions.
 * @returns A query hook that fetches all game sessions for the specified semester.
 */
export const useGetAllGameSessionsBySemester = (
  id: string,
  sessionTimeFrame?: GameSessionTimeframe,
) => {
  return useQuery({
    queryKey: [
      QueryKeys.GAME_SESSION_QUERY_KEY,
      QueryKeys.SEMESTER_QUERY_KEY,
      id,
      sessionTimeFrame,
    ],
    queryFn: async () =>
      await GameSessionService.getAllGameSessionsBySemester(id, sessionTimeFrame),
  })
}
