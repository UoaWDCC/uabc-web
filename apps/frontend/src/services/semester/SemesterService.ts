import {
  type GetSemesterResponse,
  GetSemesterResponseSchema,
  type GetSemestersResponse,
  GetSemestersResponseSchema,
} from "@repo/shared"
import { StatusCodes } from "http-status-codes"
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
    const { data: semester, status } = await apiClient.get(
      `/api/semesters/${id}`,
      GetSemesterResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error(`Failed to retrieve semester with id: ${id}`)
    return semester
  },

  /**
   * Retrieve all semesters.
   *
   * @returns A list of all semesters.
   */
  getSemesters: async (): Promise<GetSemestersResponse | undefined> => {
    const { data: semesters, status } = await apiClient.get(
      "/api/semesters",
      GetSemestersResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error("Failed to retrieve semesters")
    return semesters
  },
} as const

export default SemesterService
