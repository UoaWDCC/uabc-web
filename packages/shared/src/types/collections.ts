import type { Authentication, User } from "../payload-types"

export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
