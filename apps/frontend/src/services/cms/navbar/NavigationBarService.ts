import { GetNavbarResponseSchema } from "@repo/shared/schemas"
import { apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves FAQ data from the global API endpoint
 *
 * @returns A promise that resolves to the FAQ response data
 * @throws When the API request fails
 */
export const getNavigationBar = async () => {
  return await apiClient.get("/api/globals/navbar", GetNavbarResponseSchema, [
    QueryKeys.NAVIGATION_BAR_QUERY_KEY,
  ])
}
