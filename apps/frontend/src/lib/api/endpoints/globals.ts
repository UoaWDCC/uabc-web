import {
  GetFaqResponseSchema,
  GetSemesterResponseSchema,
  GetSemestersResponseSchema,
} from "@repo/shared"
import { apiClient } from "../client"

/**
 * Retrieves FAQ data from the global API endpoint
 *
 * @returns A promise that resolves to the FAQ response data
 * @throws When the API request fails
 */
export const getFaq = async () => {
  "use server"
  return await apiClient.get("/api/globals/faq", GetFaqResponseSchema, ["faq"])
}

export const getSemester = async (id: string) => {
  "use server"
  return await apiClient.get(`/api/semesters/${id}`, GetSemesterResponseSchema, ["semester", id])
}

export const getSemesters = async () => {
  "use server"
  return await apiClient.get("/api/semesters", GetSemestersResponseSchema, ["semesters"])
}
