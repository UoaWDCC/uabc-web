import { GetNavbarResponseSchema } from "@repo/shared/schemas"
import { cache } from "react"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves Navigation Bar data from the global API endpoint
 *
 * @returns A promise that resolves to the Navigation Bar response data
 * @throws When the API request fails
 */
export const getNavigationBar = cache(async () => {
  const response = await apiClient.get("/api/globals/navbar", GetNavbarResponseSchema, {
    tags: [QueryKeys.NAVIGATION_BAR_QUERY_KEY],
  })
  return ApiClient.throwIfError(response)
})
