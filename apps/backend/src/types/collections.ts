import type { Authentication, Booking, GameSession, Semester, User } from "@/payload-types"

export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">
export type CreateBookingData = Omit<Booking, "id" | "createdAt" | "updatedAt">
export type CreateGameSessionData = Omit<GameSession, "id" | "createdAt" | "updatedAt">
export type CreateSemesterData = Omit<Semester, "id" | "createdAt" | "updatedAt">
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
