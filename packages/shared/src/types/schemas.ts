import type { UserInfoResponseSchema } from "@/schemas"
import type z from "zod"

export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
