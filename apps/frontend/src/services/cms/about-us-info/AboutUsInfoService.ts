import { GetAboutUsInfoResponseSchema } from "@repo/shared/schemas"
import { cache } from "react"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves About Us Info data from the global API endpoint
 *
 * @returns A promise that resolves to the About Us Info response data
 * @throws When the API request fails
 */
export const getAboutUsInfo = cache(async () => {
  "use server"
  const response = await apiClient.get("/api/globals/about-us-info", GetAboutUsInfoResponseSchema, {
    tags: [QueryKeys.ABOUT_US_INFO_QUERY_KEY],
  })
  return ApiClient.throwIfError(response)
})
