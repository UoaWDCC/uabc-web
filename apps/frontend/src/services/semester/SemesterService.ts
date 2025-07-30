import {
  type GetAllSemestersResponse,
  GetAllSemestersResponseSchema,
  type GetSemesterResponse,
  GetSemesterResponseSchema,
} from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

/**
 * Service for managing semester data.
 */
const SemesterService = {
  /**
   * Retrieve a specific semester by its ID.
   *
   * @param id The ID of the semester to retrieve.
   * @returns The semester data for the given semester ID.
   */
  getSemester: async (id: string): Promise<GetSemesterResponse | undefined> => {
    const response = await apiClient.get(`/api/semesters/${id}`, GetSemesterResponseSchema)
    return ApiClient.throwIfError(response)
  },

  /**
   * Retrieve all semesters.
   *
   * @returns A list of all semesters.
   */
  getAllSemesters: async (): Promise<GetAllSemestersResponse | undefined> => {
    const response = await apiClient.get("/api/semesters", GetAllSemestersResponseSchema)
    return ApiClient.throwIfError(response)
  },
} as const

export default SemesterService
