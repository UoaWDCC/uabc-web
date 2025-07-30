import { GetTosResponseSchema } from "@repo/shared"
import { cache } from "react"
import { ApiClient, apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

export const getTos = cache(async () => {
  const response = await apiClient.get("/api/globals/tos", GetTosResponseSchema, {
    tags: [QueryKeys.TOS_QUERY_KEY],
  })
  return ApiClient.throwIfError(response)
})
