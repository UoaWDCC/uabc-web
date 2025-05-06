import type { Authentication, GameSessionSchedule, User } from "@/payload-types"

export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
export type CreateGameSessionScheduleData = Omit<
  GameSessionSchedule,
  "id" | "createdAt" | "updatedAt"
>

/**
 * Type for updating a {@link GameSessionSchedule} document
 */
export type UpdateGameSessionScheduleData = Partial<CreateGameSessionScheduleData>
