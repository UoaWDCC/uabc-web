import type { UpdateGameSessionRequest } from "@repo/shared"
import { GetBookingsResponseSchema, GetGameSessionResponseSchema } from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminGameSessionService = {
  /**
   * Fetches a game session's bookings by its ID.
   *
   * @param id The ID of the game session to fetch bookings for.
   * @returns The bookings associated with the game session.
   */
  getAllGameSessionBookings: async (id: string) => {
    const response = await apiClient.get(
      `/admin/game-sessions/${id}/bookings`,
      GetBookingsResponseSchema,
      { requiresAuth: true },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Creates a new game session with the provided data.
   *
   * @param data The data for the new game session.
   * @returns The created game session.
   * @throws An error if the creation fails.
   */
  createGameSession: async (data: UpdateGameSessionRequest) => {
    const response = await apiClient.post(
      "/admin/game-sessions",
      data,
      GetGameSessionResponseSchema,
      { requiresAuth: true },
    )
    return ApiClient.throwIfError(response)
  },

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
      { requiresAuth: true },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Delete a game session by its ID.
   *
   * @param id The ID of the game session to delete.
   */
  deleteGameSession: async (id: string) => {
    const response = await apiClient.delete(`/admin/game-sessions/${id}`, undefined, {
      requiresAuth: true,
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminGameSessionService
