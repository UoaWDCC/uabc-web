import { GetFaqResponseSchema } from "@repo/shared"
import type { Faq } from "@repo/shared/payload-types"
import { apiClient } from "../client"

export const getFaq = async (): Promise<Faq> => {
  "use server"
  const response = await apiClient.get("/api/globals/faq", GetFaqResponseSchema, ["faq"])
  return response.data
}
