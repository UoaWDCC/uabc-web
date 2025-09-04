import type { UpdateGameSessionRequest } from "@repo/shared"
import { GetBookingsResponseSchema, GetGameSessionResponseSchema } from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminGameSessionService = {
  /**
   * Fetches a game session's bookings by its ID.
   *
   * @param id The ID of the game session to fetch bookings for.
   * @param token The auth token to use for the request (may be null).
   * @returns The bookings associated with the game session.
   */
  getAllGameSessionBookings: async (id: string, token: string | null) => {
    const response = await apiClient.get(
      `/admin/game-sessions/${id}/bookings`,
      GetBookingsResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Creates a new game session with the provided data.
   *
   * @param data The data for the new game session.
   * @param token The auth token to use for the request (may be null).
   * @returns The created game session.
   * @throws An error if the creation fails.
   */
  createGameSession: async ({
    data,
    token,
  }: {
    data: UpdateGameSessionRequest
    token: string | null
  }) => {
    const response = await apiClient.post(
      "/admin/game-sessions",
      data,
      GetGameSessionResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Update the details of an existing game session.
   *
   * @param id The ID of the game session to update.
   * @param data The updated data for the game session.
   * @param token The auth token to use for the request (may be null).
   * @returns The updated game session.
   */
  updateGameSession: async ({
    id,
    data,
    token,
  }: {
    id: string
    data: UpdateGameSessionRequest
    token: string | null
  }) => {
    const response = await apiClient.patch(
      `/admin/game-sessions/${id}`,
      data,
      GetGameSessionResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },

  /**
   * Delete a game session by its ID.
   *
   * @param id The ID of the game session to delete.
   * @param token The auth token to use for the request (may be null).
   */
  deleteGameSession: async (id: string, token: string | null) => {
    const response = await apiClient.delete(`/admin/game-sessions/${id}`, undefined, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminGameSessionService
