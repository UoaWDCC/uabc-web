import type { UpdateGameSessionRequest } from "@repo/shared"
import { GetGameSessionResponseSchema } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const AdminGameSessionService = {
  /**
   * Update the details of an existing game session.
   *
   * @param id The ID of the game session to update.
   * @param data The updated data for the game session.
   * @returns The updated game session.
   */
  updateGameSession: async (id: string, data: UpdateGameSessionRequest) => {
    const { data: updatedGameSession, status } = await apiClient.put(
      `/admin/game-sessions/${id}`,
      data,
      GetGameSessionResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error(`Failed to update game session with id: ${id}`)
    return updatedGameSession
  },

  /**
   * Delete a game session by its ID.
   *
   * @param id The ID of the game session to delete.
   */
  deleteGameSession: async (id: string) => {
    const { status } = await apiClient.delete(`/admin/game-sessions/${id}`)
    if (status !== StatusCodes.NO_CONTENT)
      throw new Error(`Failed to delete game session with id: ${id}`)
  },
} as const

export default AdminGameSessionService
