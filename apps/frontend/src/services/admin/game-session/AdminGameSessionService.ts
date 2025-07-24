import type { UpdateGameSessionRequest } from "@repo/shared"
import { GetGameSessionResponseSchema } from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminGameSessionService = {
  /**
   * Update the details of an existing game session.
   *
   * @param id The ID of the game session to update.
   * @param data The updated data for the game session.
   * @returns The updated game session.
   */
  updateGameSession: async ({ id, data }: { id: string; data: UpdateGameSessionRequest }) => {
    const response = await apiClient.patch(
      `/admin/game-sessions/${id}`,
      data,
      GetGameSessionResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Delete a game session by its ID.
   *
   * @param id The ID of the game session to delete.
   */
  deleteGameSession: async (id: string) => {
    const response = await apiClient.delete(`/admin/game-sessions/${id}`)
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminGameSessionService
