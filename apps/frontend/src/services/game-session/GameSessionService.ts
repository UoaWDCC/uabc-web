import {
  GetAllGameSessionsResponseSchema,
  GetGameSessionResponseSchema,
  type PaginationQuery,
} from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const GameSessionService = {
  /**
   * Retrieves a specific game session by its ID.
   *
   * @param id The ID of the game session to retrieve.
   * @returns The game session data for the given ID.
   */
  getGameSession: async (id: string) => {
    const { data: gameSession, status } = await apiClient.get(
      `/api/game-sessions/${id}`,
      GetGameSessionResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error(`Failed to retrieve game session with id: ${id}`)
    return gameSession
  },

  /**
   * Retrieves all game sessions with pagination.
   *
   * @param query The pagination query parameters.
   * @returns A list of all game sessions.
   */
  getAllGameSessions: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const { data, status } = await apiClient.get(
      `/api/game-sessions?${query}`,
      GetAllGameSessionsResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error("Failed to retrieve all game sessions")
    return data
  },
} as const

export default GameSessionService
