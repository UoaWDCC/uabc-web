import type { CreateSemesterRequest, UpdateSemesterRequest } from "@repo/shared"
import { GetSemesterResponseSchema } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const AdminSemesterService = {
  /**
   * Create a new semester.
   *
   * @param data The data for the new semester.
   * @returns The created semester.
   */
  createSemester: async (data: CreateSemesterRequest) => {
    const { data: createdSemester, status } = await apiClient.post(
      "/admin/semesters",
      data,
      GetSemesterResponseSchema,
    )
    if (status !== StatusCodes.CREATED) throw new Error("Failed to create semester")
    return createdSemester
  },
  /**
   * Update an existing semester.
   *
   * @param id The ID of the semester to update.
   * @param data The updated data for the semester.
   * @returns The updated semester.
   */
  updateSemester: async (id: string, data: UpdateSemesterRequest) => {
    const { data: updatedSemester, status } = await apiClient.put(
      `/admin/semesters/${id}`,
      data,
      GetSemesterResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error("Failed to update semester")
    return updatedSemester
  },
  /**
   * Delete an existing semester.
   *
   * @param id The ID of the semester to delete.
   * @returns The deleted semester.
   */
  deleteSemester: async (id: string) => {
    const { status } = await apiClient.delete(`/admin/semesters/${id}`)
    if (status !== StatusCodes.NO_CONTENT) throw new Error("Failed to delete semester")
  },
} as const
export default AdminSemesterService
