import type { GameSession, GameSessionSchedule, User } from "../payload-types"
import { Gender, PlayLevel } from "../types/enums"

/**
 * Checks if the provided value is a valid Gender enum value. Returns the value if valid, otherwise undefined.
 * @param value The value to check
 * @returns The Gender enum value if valid, otherwise undefined
 */
export const isGender = (value: unknown): Gender | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  return Object.values(Gender).includes(value as Gender) ? (value as Gender) : undefined
}

/**
 * Checks if the provided value is a valid PlayLevel enum value. Returns the value if valid, otherwise undefined.
 * @param value The value to check
 * @returns The PlayLevel enum value if valid, otherwise undefined
 */
export const isPlayLevel = (value: unknown): PlayLevel | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  return Object.values(PlayLevel).includes(value as PlayLevel) ? (value as PlayLevel) : undefined
}

/**
 * Type guard to check if a value is a User object with required properties
 *
 * @param user The value to check
 * @returns True if the value is a User object, false otherwise
 */
export const isUserObject = (user: User | string | null | undefined): user is User => {
  return !!user && typeof user === "object"
}

/**
 * Returns a payload object ID if the object is an object with an id property, otherwise returns the string itself.
 *
 * @param stringOrObject The possible object or string
 * @returns The document ID
 */
export const getPayloadObjectId = <T extends { id: string } | string>(
  stringOrObject: T,
): string => {
  return typeof stringOrObject === "object" ? stringOrObject.id : stringOrObject
}

/**
 * Type guard to check if a value is a GameSession object with required properties
 *
 * @param gameSession The value to check
 * @returns True if the value is a GameSession object, false otherwise
 */
export const isGameSessionObject = (
  gameSession: GameSession | string | null | undefined,
): gameSession is GameSession => {
  return !!gameSession && typeof gameSession === "object"
}

/**
 * Type guard to check if a value is a GameSessionSchedule object with required properties
 *
 * @param schedule The value to check
 * @returns True if the value is a GameSessionSchedule object, false otherwise
 */
export const isGameSessionScheduleObject = (
  schedule: GameSessionSchedule | string | null | undefined,
): schedule is GameSessionSchedule => {
  return !!schedule && typeof schedule === "object"
}
