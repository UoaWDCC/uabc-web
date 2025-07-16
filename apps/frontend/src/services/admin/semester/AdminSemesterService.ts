import { GetSemesterResponseSchema } from "@repo/shared/schemas"
import type { CreateSemesterRequest } from "@repo/shared/types"
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
} as const
export default AdminSemesterService
