import type z from "zod"
import type {
  AdditionalInfoSchema,
  CreateUserRequestSchema,
  GetAllUsersResponseSchema,
  ProfileDetailsSchema,
  UpdateUserRequestSchema,
} from "../schemas"

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>
export type GetAllUsersResponse = z.infer<typeof GetAllUsersResponseSchema>
export type ProfileDetailsForm = z.infer<typeof ProfileDetailsSchema>
export type AdditionalInfoForm = z.infer<typeof AdditionalInfoSchema>
