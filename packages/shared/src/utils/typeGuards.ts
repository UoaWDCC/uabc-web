import { Gender, PlayLevel } from "../types/enums"

/**
 * Checks if the provided value is a valid Gender enum value. Returns the value if valid, otherwise undefined.
 */
export const isGender = (value: unknown): Gender | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  return Object.values(Gender).includes(value as Gender) ? (value as Gender) : undefined
}

/**
 * Checks if the provided value is a valid PlayLevel enum value. Returns the value if valid, otherwise undefined.
 */
export const isPlayLevel = (value: unknown): PlayLevel | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  return Object.values(PlayLevel).includes(value as PlayLevel) ? (value as PlayLevel) : undefined
}
