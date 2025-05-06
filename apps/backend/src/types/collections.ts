import type { Authentication, Booking, GameSession, Semester, User } from "@/payload-types"

/*
 * Type for creating authentication data without system-generated fields
 */
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

/*
 * Type for creating user data without system-generated fields
 */
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">

/*
 * Type for partially editing booking data
 */
export type EditBookingData = Partial<CreateBookingData>

/*
 * Type for partially editing user data
 */
export type EditUserData = Partial<CreateUserData>
