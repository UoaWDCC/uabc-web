import { GetTosResponseSchema } from "@repo/shared"
import { apiClient } from "@/lib/api/client"
import { QueryKeys } from "@/services"

export const getTos = async () => {
  return await apiClient.get("/api/globals/tos", GetTosResponseSchema, [QueryKeys.TOS_QUERY_KEY])
}
