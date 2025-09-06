import { GetLocationBubbleResponseSchema } from "@repo/shared/schemas"
import { cache } from "react"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves Location Bubble data from the global API endpoint
 *
 * @returns A promise that resolves to the Location Bubble response data
 * @throws When the API request fails
 */
export const getLocationBubble = cache(async () => {
  const response = await apiClient.get(
    "/api/globals/location-bubble",
    GetLocationBubbleResponseSchema,
    {
      tags: [QueryKeys.LOCATION_BUBBLE_QUERY_KEY],
    },
  )
  return ApiClient.throwIfError(response)
})
