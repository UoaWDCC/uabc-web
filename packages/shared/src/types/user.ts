import type z from "zod"
import type { CreateUserRequestSchema, UpdateUserRequestSchema } from "../schemas"

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>
