import type z from "zod"
import type {
  JWTEncryptedUserSchema,
  LoginDetailsSchema,
  RegisterPanelDetailsSchema,
  UserInfoResponseSchema,
} from "../schemas"

export const AUTH_COOKIE_NAME = "auth_token"
export const STATE_COOKIE_NAME = "state"
export const TOKEN_EXPIRY_TIME = "1h"

export type JWTEncryptedUser = z.infer<typeof JWTEncryptedUserSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
export type LoginDetails = z.infer<typeof LoginDetailsSchema>
export type RegisterPanelDetails = z.infer<typeof RegisterPanelDetailsSchema>
