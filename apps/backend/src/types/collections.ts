import type { Authentication, Semester, User } from "@/payload-types"

/*
 * Type for creating authentication data without system-generated fields
 */
export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">

/*
 * Type for creating user data without system-generated fields
 */
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
export type CreateSemesterData = Omit<Semester, "id" | "createdAt" | "updatedAt">
export type UpdateSemesterData = Partial<CreateSemesterData>

/*
 * Type for partially editing user data
 */
export type EditUserData = Partial<CreateUserData>
