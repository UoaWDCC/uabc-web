import type z from "zod"
import type {
  CreateUserRequestSchema,
  GetAllUsersResponseSchema,
  UpdateUserRequestSchema,
} from "../schemas"

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>
export type GetAllUsersResponse = z.infer<typeof GetAllUsersResponseSchema>
