import type { SessionItem } from "./SelectACourt"

/**
 * Method to process sessions and update their properties based on the provided parameters.
 *
 * @param sessions Array of session items to be processed.
 * @param selected Array of selected session values.
 * @param isMember Indicates if the user is a member.
 * @param capReached Indicates if the session capacity has been reached.
 * @returns Array of processed session items.
 */
export function processSessions(
  sessions: SessionItem[],
  selected: string[],
  isMember: boolean,
  capReached: boolean,
) {
  return sessions.map((s) => {
    const isSelected = selected.includes(s.value)
    return {
      ...s,
      memberAttendees: isMember ? s.memberAttendees : undefined,
      casualAttendees: isMember ? s.casualAttendees : undefined,
      disabled: s.disabled || (capReached && !isSelected),
    }
  })
}

/**
 * Method to get the next selection based on the provided parameters.
 *
 * @param next Array of next session values.
 * @param selected Array of selected session values.
 * @param isMember Indicates if the user is a member.
 * @param maxBookings Maximum number of bookings allowed.
 * @returns Array of next selection or undefined.
 */
export function getNextSelection(
  next: string[],
  selected: string[],
  isMember: boolean,
  maxBookings: number,
) {
  if (isMember) {
    if (next.length > maxBookings) return selected
    return next.length ? next : undefined
  }
  const last = next[next.length - 1]
  const newArray = selected[0] === last ? [] : [last]
  return newArray[0] ?? undefined
}
