import {
  type GetSemesterResponse,
  GetSemesterResponseSchema,
  type GetSemestersResponse,
  GetSemestersResponseSchema,
} from "@repo/shared"
import { apiClient } from "@/lib/api/client"

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
    if (!response.success) throw new Error(`Failed to retrieve semester with id: ${id}`)
    return response.data
  },

  /**
   * Retrieve all semesters.
   *
   * @returns A list of all semesters.
   */
  getSemesters: async (): Promise<GetSemestersResponse | undefined> => {
    const response = await apiClient.get("/api/semesters", GetSemestersResponseSchema)
    if (!response.success) throw new Error("Failed to retrieve semesters")
    return response.data
  },
} as const

export default SemesterService
