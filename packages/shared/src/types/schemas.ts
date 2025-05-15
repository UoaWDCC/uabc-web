import type { JWTSchema, UserInfoResponseSchema } from "@/schemas"
import type z from "zod"

export type JWT = z.infer<typeof JWTSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
