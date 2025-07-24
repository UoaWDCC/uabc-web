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
   * @returns The created game session schedule.
   */
  createGameSessionSchedule: async (data: CreateGameSessionScheduleRequest) => {
    const response = await apiClient.post(
      "/admin/game-session-schedules",
      data,
      GetGameSessionScheduleResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches all game session schedules.
   *
   * @param query The pagination query parameters.
   * @returns A promise that resolves to an array of game session schedules.
   */
  getPaginatedGameSessionSchedules: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const response = await apiClient.get(
      `/admin/game-session-schedules?${query}`,
      GetAllGameSessionSchedulesResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches a specific game session schedule by ID.
   *
   * @param id The game session schedule ID.
   * @returns A promise that resolves to a game session schedule.
   */
  getGameSessionSchedule: async (id: string) => {
    const response = await apiClient.get(
      `/admin/game-session-schedules/${id}`,
      GetGameSessionScheduleResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Updates a game session schedule by ID with partial game session schedule data.
   *
   * @param id The game session schedule ID.
   * @param data The game session schedule data to update.
   * @returns A promise that resolves to the updated game session schedule.
   */
  updateGameSessionSchedule: async (id: string, data: UpdateGameSessionScheduleRequest) => {
    const response = await apiClient.patch(
      `/admin/game-session-schedules/${id}`,
      data,
      GetGameSessionScheduleResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Deletes a game session schedule by ID.
   *
   * @param id The game session schedule ID.
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteGameSessionSchedule: async (id: string) => {
    const response = await apiClient.delete(`/admin/game-session-schedules/${id}`)
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminGameSessionScheduleService
