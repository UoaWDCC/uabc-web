import type { PaginationQuery } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import GameSessionService from "./GameSessionService"

const GameSessionQuery = {
  /**
   * Retrieves and caches paginated game sessions.
   *
   * @param query The pagination query parameters.
   * @returns A query hook that fetches all game sessions.
   */
  useGetAllGameSessions: (query: PaginationQuery) => {
    return useQuery({
      queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      queryFn: () => {
        return GameSessionService.getAllGameSessions(query)
      },
    })
  },
} as const

export default GameSessionQuery
