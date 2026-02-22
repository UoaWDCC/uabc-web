import type { CreateSemesterRequest, UpdateSemesterRequest } from "@repo/shared"
import { GetSemesterResponseSchema } from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminSemesterService = {
  /**
   * Create a new semester.
   *
   * @param data The data for the new semester.
   * @returns The created semester.
   */
  createSemester: async ({
    data,
    token,
  }: {
    data: CreateSemesterRequest
    token: string | null
  }) => {
    const response = await apiClient.post("/api/admin/semesters", data, GetSemesterResponseSchema, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
  /**
   * Update an existing semester.
   *
   * @param id The ID of the semester to update.
   * @param data The updated data for the semester.
   * @returns The updated semester.
   */
  updateSemester: async ({
    id,
    data,
    token,
  }: {
    id: string
    data: UpdateSemesterRequest
    token: string | null
  }) => {
    const response = await apiClient.put(
      `/api/admin/semesters/${id}`,
      data,
      GetSemesterResponseSchema,
      { requiresAuth: true, token },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Delete an existing semester.
   *
   * @param id The ID of the semester to delete.
   * @returns The deleted semester.
   */
  deleteSemester: async ({ id, token }: { id: string; token: string | null }) => {
    const response = await apiClient.delete(`/api/admin/semesters/${id}`, undefined, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminSemesterService
