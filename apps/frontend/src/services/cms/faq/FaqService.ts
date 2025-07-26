import { GetFaqResponseSchema } from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves FAQ data from the global API endpoint
 *
 * @returns A promise that resolves to the FAQ response data
 * @throws When the API request fails
 */
export const getFaq = async () => {
  const response = await apiClient.get("/api/globals/faq", GetFaqResponseSchema, {
    tags: [QueryKeys.FAQ_QUERY_KEY],
  })
  return ApiClient.throwIfError(response)
}
