import { GetFaqResponseSchema } from "@repo/shared"
import { apiClient } from "../client"

export const getFaq = async () => {
  "use server"
  return await apiClient.get("/api/globals/faq", GetFaqResponseSchema, ["faq"])
}
