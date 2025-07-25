import {
  GetAllGameSessionsResponseSchema,
  GetGameSessionResponseSchema,
  type PaginationQuery,
} from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const GameSessionService = {
  /**
   * Retrieves a specific game session by its ID.
   *
   * @param id The ID of the game session to retrieve.
   * @returns The game session data for the given ID.
   */
  getGameSession: async (id: string) => {
    const response = await apiClient.get(`/api/game-sessions/${id}`, GetGameSessionResponseSchema)
    return ApiClient.throwIfError(response)
  },

  /**
   * Retrieves all game sessions with pagination.
   *
   * @param query The pagination query parameters.
   * @returns A list of all game sessions.
   */
  getPaginatedGameSessions: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const response = await apiClient.get(
      `/api/game-sessions?${query}`,
      GetAllGameSessionsResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
} as const

export default GameSessionService
