import type { Authentication, GameSessionSchedule, User } from "@/payload-types"

export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
export type CreateGameSessionScheduleData = Omit<
  GameSessionSchedule,
  "id" | "createdAt" | "updatedAt"
>
