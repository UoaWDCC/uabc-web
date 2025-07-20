import type { NextRequest } from "next/server"
import type z from "zod"
import type { User } from "../../payload-types"
import type {
  JWTEncryptedUserSchema,
  LoginFormDataSchema,
  LoginRequestBodySchema,
  LoginResponseSchema,
  RegisterDetailsSchema,
  UserInfoResponseSchema,
} from "../../schemas"

export const AUTH_COOKIE_NAME = "auth_token"
export const STATE_COOKIE_NAME = "state"
export const TOKEN_EXPIRY_TIME = "1h"

export type RequestWithUser = NextRequest & { user: User }
export type JWTEncryptedUser = z.infer<typeof JWTEncryptedUserSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type LoginFormData = z.infer<typeof LoginFormDataSchema>

export type RegisterDetails = z.infer<typeof RegisterDetailsSchema>
