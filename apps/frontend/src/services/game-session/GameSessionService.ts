import {
  type GetAllGameSessionsBySemesterResponse,
  GetAllGameSessionsBySemesterResponseSchema,
  GetGameSessionResponseSchema,
  GetPaginatedGameSessionsResponseSchema,
  type PaginationQuery,
  SearchParams,
  TimeframeFilter,
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
      GetPaginatedGameSessionsResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Retrieves all game sessions for a specific semester ID.
   *
   * @param id The ID of the semester to retrieve game sessions for.
   * @param sessionTimeframe Optional timeframe for filtering game sessions.
   * @returns An array of game sessions for the specified semester.
   */
  getAllGameSessionsBySemester: async (
    id: string,
    sessionTimeframe: TimeframeFilter = TimeframeFilter.DEFAULT,
  ): Promise<GetAllGameSessionsBySemesterResponse> => {
    const path = `/api/semesters/${id}/game-sessions`
    const url = sessionTimeframe
      ? `${path}?${SearchParams.SESSION_TIMEFRAME}=${sessionTimeframe}`
      : path
    const response = await apiClient.get(url, GetAllGameSessionsBySemesterResponseSchema)
    return ApiClient.throwIfError(response)
  },
} as const

export default GameSessionService
