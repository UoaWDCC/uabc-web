import type { Authentication, Booking, GameSession, Semester, User } from "@/payload-types"

export type CreateAuthenticationData = Omit<Authentication, "id" | "createdAt" | "updatedAt">

/*
 * Type for creating booking data without system-generated fields
 */
export type CreateBookingData = Omit<Booking, "id" | "createdAt" | "updatedAt">

/*
 * Type for creating game session data without system-generated fields
 */
export type CreateGameSessionData = Omit<GameSession, "id" | "createdAt" | "updatedAt">

/*
 * Type for creating semester data without system-generated fields
 */
export type CreateSemesterData = Omit<Semester, "id" | "createdAt" | "updatedAt">
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">
