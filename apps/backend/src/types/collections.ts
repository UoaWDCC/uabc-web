import type { Authentication, User } from "@/payload-types"

/*
 * The Authentication Data Service typings
 */
export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">

/*
 * The User Data Service typings
 */
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
export type EditUserData = Partial<CreateUserData>
