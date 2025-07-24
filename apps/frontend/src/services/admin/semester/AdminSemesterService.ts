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
  createSemester: async (data: CreateSemesterRequest) => {
    const response = await apiClient.post("/admin/semesters", data, GetSemesterResponseSchema)
    return ApiClient.throwIfError(response)
  },
  /**
   * Update an existing semester.
   *
   * @param id The ID of the semester to update.
   * @param data The updated data for the semester.
   * @returns The updated semester.
   */
  updateSemester: async ({ id, data }: { id: string; data: UpdateSemesterRequest }) => {
    const response = await apiClient.put(`/admin/semesters/${id}`, data, GetSemesterResponseSchema)
    return ApiClient.throwIfError(response)
  },
  /**
   * Delete an existing semester.
   *
   * @param id The ID of the semester to delete.
   * @returns The deleted semester.
   */
  deleteSemester: async (id: string) => {
    const response = await apiClient.delete(`/admin/semesters/${id}`)
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminSemesterService
