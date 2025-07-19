import { GetTosResponseSchema } from "@repo/shared"
import { cache } from "react"
import { apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

export const getTos = cache(async () => {
  "use server"
  return await apiClient.get("/api/globals/tos", GetTosResponseSchema, {
    tags: [QueryKeys.TOS_QUERY_KEY],
  })
})
