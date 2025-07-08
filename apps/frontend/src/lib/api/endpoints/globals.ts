import type { Faq } from "@repo/shared/payload-types"
import { GetFaqResponseSchema } from "@repo/shared/schemas"
import { api } from "../client"

export const getFaq = async (): Promise<Faq> => {
  "use server"
  const response = await api.get("/api/globals/faq", GetFaqResponseSchema, ["faq"])
  return response.data
}
