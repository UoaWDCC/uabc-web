import type { NextRequest } from "next/server"
import type { User } from "../payload-types"

export const AUTH_COOKIE_NAME = "auth_token"
export const STATE_COOKIE_NAME = "state"
export const TOKEN_EXPIRY_TIME = "1h"

export type RequestWithUser = NextRequest & { user: User }
