import type z from "zod"
import type {
  JWTEncryptedUserSchema,
  LoginFormSchema,
  LoginRequestBodySchema,
  LoginResponseSchema,
  RegisterPanelDetailsSchema,
  UserInfoResponseSchema,
} from "../schemas"

export const AUTH_COOKIE_NAME = "auth_token"
export const STATE_COOKIE_NAME = "state"
export const TOKEN_EXPIRY_TIME = "1h"

export type JWTEncryptedUser = z.infer<typeof JWTEncryptedUserSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>
export type RegisterPanelDetails = z.infer<typeof RegisterPanelDetailsSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type LoginForm = z.infer<typeof LoginFormSchema>
