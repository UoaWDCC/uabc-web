import { GetFaqResponseSchema } from "@repo/shared/schemas"
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
