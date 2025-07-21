import type z from "zod"
import type {
  GoogleUserInfoResponseSchema,
  JWTEncryptedUserSchema,
  LoginFormDataSchema,
  LoginRequestBodySchema,
  LoginResponseSchema,
  RegisterRequestBodySchema,
} from "../../schemas"

export const AUTH_COOKIE_NAME = "auth_token"
export const STATE_COOKIE_NAME = "state"
export const TOKEN_EXPIRY_TIME = "1h"

export type JWTEncryptedUser = z.infer<typeof JWTEncryptedUserSchema>
export type GoogleUserInfo = z.infer<typeof GoogleUserInfoResponseSchema>
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type LoginFormData = z.infer<typeof LoginFormDataSchema>

export type RegisterRequestBody = z.infer<typeof RegisterRequestBodySchema>
