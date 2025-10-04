import { GetOnboardingResponseSchema } from "@repo/shared"
import { cache } from "react"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

/**
 * Retrieves Onboarding data from the global API endpoint
 *
 * @returns A promise that resolves to the Onboarding response data
 * @throws When the API request fails
 */
export const getOnboarding = cache(async () => {
  const response = await apiClient.get("/api/globals/onboarding", GetOnboardingResponseSchema, {
    tags: [QueryKeys.ONBOARDING],
  })
  return ApiClient.throwIfError(response)
})
