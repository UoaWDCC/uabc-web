import {
  type CreateGameSessionScheduleRequest,
  GetAllGameSessionSchedulesResponseSchema,
  GetGameSessionScheduleResponseSchema,
  type PaginationQuery,
  type UpdateGameSessionScheduleRequest,
} from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminGameSessionScheduleService = {
  /**
   * Creates a new game session schedule.
   *
   * @param data The game session schedule data to create.
   * @param token The auth token to use for the request (may be null).
   * @returns The created game session schedule.
   */
  createGameSessionSchedule: async ({
    data,
    token,
  }: {
    data: CreateGameSessionScheduleRequest
    token: string | null
  }) => {
    const response = await apiClient.post(
      "/admin/game-session-schedules",
      data,
      GetGameSessionScheduleResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches all game session schedules.
   *
   * @param query The pagination query parameters.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to an array of game session schedules.
   */
  getPaginatedGameSessionSchedules: async ({
    limit = 100,
    page,
    token,
  }: PaginationQuery & { token: string | null }) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const response = await apiClient.get(
      `/admin/game-session-schedules?${query}`,
      GetAllGameSessionSchedulesResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches a specific game session schedule by ID.
   *
   * @param id The game session schedule ID.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to a game session schedule.
   */
  getGameSessionSchedule: async ({ id, token }: { id: string; token: string | null }) => {
    const response = await apiClient.get(
      `/admin/game-session-schedules/${id}`,
      GetGameSessionScheduleResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Updates a game session schedule by ID with partial game session schedule data.
   *
   * @param id The game session schedule ID.
   * @param data The game session schedule data to update.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to the updated game session schedule.
   */
  updateGameSessionSchedule: async ({
    id,
    data,
    token,
  }: {
    id: string
    data: UpdateGameSessionScheduleRequest
    token: string | null
  }) => {
    const response = await apiClient.patch(
      `/admin/game-session-schedules/${id}`,
      data,
      GetGameSessionScheduleResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Deletes a game session schedule by ID.
   *
   * @param id The game session schedule ID.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteGameSessionSchedule: async ({ id, token }: { id: string; token: string | null }) => {
    const response = await apiClient.delete(`/admin/game-session-schedules/${id}`, undefined, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminGameSessionScheduleService
