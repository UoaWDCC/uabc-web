import { type PaginationQuery, TimeframeFilter } from "@repo/shared"
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
    queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY, { limit: query.limit }],
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
export const useGetAllGameSessionsBySemester = (id: string, sessionTimeFrame?: TimeframeFilter) => {
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

/**
 * Retrieves and caches all current game sessions.
 *
 * @returns A query hook that fetches all current game sessions.
 */
export const useGetCurrentGameSessions = () => {
  return useQuery({
    queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY, TimeframeFilter.CURRENT],
    queryFn: GameSessionService.getCurrentGameSessions,
  })
}
