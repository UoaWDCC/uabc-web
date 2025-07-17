import {
  CreateGameSessionScheduleRequest,
  GetAllGameSessionSchedulesResponseSchema,
  GetGameSessionScheduleResponseSchema,
  UpdateGameSessionScheduleRequest,
  type PaginationQuery,
} from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const AdminGameSessionScheduleService = {
  /**
   * Creates a new game session schedule.
   *
   * @param data The game session schedule data to create.
   * @returns The created game session schedule.
   */
  createGameSessionSchedule: async (data: CreateGameSessionScheduleRequest) => {
    const { data: createdGameSessionSchedule, status } = await apiClient.post(
      "/admin/game-session-schedules",
      data,
      GetGameSessionScheduleResponseSchema,
    )
    if (status !== StatusCodes.CREATED) throw new Error("Failed to create game session schedule")
    return createdGameSessionSchedule
  },
  /**
   * Fetches all game session schedules.
   *
   * @param query The pagination query parameters.
   * @returns A promise that resolves to an array of game session schedules.
   */
  getAllGameSessionSchedules: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const { data, status } = await apiClient.get(`/admin/game-session-schedules?${query}`, GetAllGameSessionSchedulesResponseSchema)
    if (status !== StatusCodes.OK) throw new Error("Failed to fetch all game session schedules")
    return data
  },
  /**
   * Fetches a specific game session schedule by ID.
   *
   * @param id The game session schedule ID.
   * @returns A promise that resolves to a game session schedule.
   */
  getGameSessionSchedule: async (id: string) => {
    const { data, status } = await apiClient.get(`/admin/game-session-schedules/${id}`, GetGameSessionScheduleResponseSchema)
    if (status !== StatusCodes.OK) throw new Error("Failed to fetch game session schedule")
    return data
  },
  /**
   * Updates a game session schedule by ID with partial game session schedule data.
   *
   * @param id The game session schedule ID.
   * @param data The game session schedule data to update.
   * @returns A promise that resolves to the updated game session schedule.
   */
  updateGameSessionSchedule: async (id: string, data: UpdateGameSessionScheduleRequest) => {
    const { data: updatedGameSessionSchedule, status } = await apiClient.patch(
      `/admin/game-session-schedules/${id}`,
      data,
      GetGameSessionScheduleResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error("Failed to update game session schedule")
    return updatedGameSessionSchedule
  },
  /**
   * Deletes a game session schedule by ID.
   *
   * @param id The game session schedule ID.
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteGameSessionSchedule: async (id: string) => {
    const { status } = await apiClient.delete(`/admin/game-session-schedules/${id}`)
    if (status !== StatusCodes.NO_CONTENT) throw new Error("Failed to delete game session schedule")
  },
} as const

export default AdminGameSessionScheduleService
