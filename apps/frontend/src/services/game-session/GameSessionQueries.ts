import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import GameSessionService from "./GameSessionService"

/**
 * Retrieves and caches paginated game sessions.
 *
 * @param query The pagination query parameters.
 * @returns A query hook that fetches all game sessions.
 */
export const useGetPaginatedGameSessions = (query: PaginationQuery) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await GameSessionService.getAllPaginatedGameSessions({
        ...query,
        page: pageParam,
      })
      return response
    },
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage,
    getPreviousPageParam: (firstPage) => firstPage?.data?.prevPage,
  })
}
