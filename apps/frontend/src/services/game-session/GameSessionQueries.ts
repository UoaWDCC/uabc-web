import type { GameSessionTimeframe, PaginationQuery, SessionItem } from "@repo/shared"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { QueryKeys } from "@/services"
import { mapGameSessionsToSessionItems } from "./GameSessionAdapter"
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
 * Aggregates loaded paginated sessions and maps them to {@link SessionItem} for the booking UI.
 * This keeps the `BookFlow` component simple and decoupled from API shapes.
 */
export const useAvailableSessions = () => {
  const query = useGetPaginatedGameSessions({ limit: 100, page: 1 })

  const sessions = useMemo((): SessionItem[] => {
    const docs = query.data?.pages?.flatMap((p) => p.data?.docs ?? []) ?? []
    return mapGameSessionsToSessionItems(docs)
  }, [query.data])

  return {
    sessions,
    isLoading: query.isLoading || query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
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
