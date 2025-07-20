import type { Footer } from "@repo/shared/payload-types"
import { GetFooterResponseSchema } from "@repo/shared/schemas"
import { cache } from "react"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves {@link Footer} data from the global API endpoint
 *
 * @returns A promise that resolves to the {@link Footer} response data
 * @throws When the API request fails
 */
export const getFooter = cache(async () => {
  "use server"
  const response = await apiClient.get("/api/globals/footer", GetFooterResponseSchema, {
    tags: [QueryKeys.FOOTER_QUERY_KEY],
  })
  return ApiClient.throwIfError(response, "Failed to retrieve footer data")
})
