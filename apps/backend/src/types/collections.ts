import type { Authentication, Semester, User } from "@/payload-types"

export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
export type CreateSemesterData = Omit<Semester, "id" | "createdAt" | "updatedAt">
export type UpdateSemesterData = Partial<CreateSemesterData>
