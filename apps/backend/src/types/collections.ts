import type { Authentication, Semester, User } from "@/payload-types"

/*
 * Type for creating authentication data without system-generated fields
 */
export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">

/*
 * Type for creating user data without system-generated fields
 */
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">

/*
 * Type for creating semester data without system-generated fields
 */
export type CreateSemesterData = Omit<Semester, "id" | "createdAt" | "updatedAt">

/*
 * Type for partially editing semester data
 */

export type EditSemesterData = Partial<CreateSemesterData>

/*
 * Type for partially editing user data
 */
export type EditUserData = Partial<CreateUserData>
