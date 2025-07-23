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
    return ApiClient.throwIfError(response, "Failed to create semester")
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
    semesterData,
  }: {
    id: string
    semesterData: UpdateSemesterRequest
  }) => {
    const response = await apiClient.put(
      `/admin/semesters/${id}`,
      semesterData,
      GetSemesterResponseSchema,
    )
    return ApiClient.throwIfError(response, "Failed to update semester")
  },
  /**
   * Delete an existing semester.
   *
   * @param id The ID of the semester to delete.
   * @returns The deleted semester.
   */
  deleteSemester: async (id: string) => {
    const response = await apiClient.delete(`/admin/semesters/${id}`)
    return ApiClient.throwIfError(response, "Failed to delete semester")
  },
} as const

export default AdminSemesterService
