import type {
  Authentication,
  Booking,
  Event,
  GameSession,
  GameSessionSchedule,
  Semester,
  User,
} from "../payload-types"

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
 * Type for creating event data without system-generated fields
 */
export type CreateEventData = Omit<Event, "id" | "createdAt" | "updatedAt">

/**
 * Type for creating a new {@link GameSessionSchedule} document
 */
export type CreateGameSessionScheduleData = Omit<
  GameSessionSchedule,
  "id" | "createdAt" | "updatedAt"
>

/**
 * Type for updating {@link Authentication} document
 */
export type UpdateAuthenticationData = Partial<CreateAuthenticationData>

/**
 * Type for updating {@link GameSession} document
 */
export type UpdateGameSessionData = Partial<CreateGameSessionData>

/**
 * Type for updating a {@link GameSessionSchedule} document
 */
export type UpdateGameSessionScheduleData = Partial<CreateGameSessionScheduleData>
/*
 * Type for partially editing booking data
 */
export type EditBookingData = Partial<CreateBookingData>

/*
 * Type for partially editing semester data
 */

export type EditSemesterData = Partial<CreateSemesterData>

/*
 * Type for partially editing user data
 */
export type EditUserData = Partial<CreateUserData>

/**
 * Type for partially editing user data without fields a user is not allowed to modify
 */
export type EditSelfData = Omit<EditUserData, "email" | "remainingSessions" | "role">
