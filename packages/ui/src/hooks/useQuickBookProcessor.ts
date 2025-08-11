"use client"

import { MembershipType, PlayLevel, type SessionItem } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { parseAsStringEnum, useQueryState } from "nuqs"
import { useCallback, useMemo } from "react"
import { useQuickBookStorage } from "./storage/quickBookStorage"

// Constants
const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Validation result types for quick book data
 */
type ValidationResult =
  | { isValid: false; reason: "no-data" | "expired" | "session-not-found" | "session-full" }
  | { isValid: true; reason: "valid" }

/**
 * Options for the useQuickBookProcessor hook
 */
interface UseQuickBookProcessorOptions<
  TAction extends { type: string; payload?: unknown } = { type: string; payload?: unknown },
> {
  /**
   * Available sessions to match against
   */
  sessions: SessionItem[]
  /**
   * Current step in the booking flow
   */
  currentStep: string
  /**
   * Function to dispatch booking flow actions
   */
  dispatch: (action: TAction) => void
  /**
   * User object to determine role and check capacity limits
   */
  user: Pick<User, "role">
  /**
   * Maximum age of quick book data in milliseconds (default: 24 hours)
   */
  maxAge?: number
}

/**
 * Validates quick book data against current state
 */
const validateQuickBookData = (
  quickBookData: {
    formData: { locationAndTimeId: string; skillLevel: PlayLevel }
    timestamp: string
  } | null,
  sessions: SessionItem[],
  maxAge: number,
  isSessionFull: (
    session: Pick<SessionItem, "capacity" | "casualCapacity" | "attendees" | "casualAttendees">,
  ) => boolean,
): ValidationResult => {
  if (!quickBookData?.formData) {
    return { isValid: false, reason: "no-data" }
  }

  // Check if the data is not too old
  const dataAge = Date.now() - new Date(quickBookData.timestamp).getTime()
  if (dataAge > maxAge) {
    return { isValid: false, reason: "expired" }
  }

  // Check if the session still exists in the available sessions
  const matchingSession = sessions.find(
    (session) => session.id === quickBookData.formData.locationAndTimeId,
  )
  if (!matchingSession) {
    return { isValid: false, reason: "session-not-found" }
  }

  // Check if the session is full
  if (isSessionFull(matchingSession)) {
    return { isValid: false, reason: "session-full" }
  }

  return { isValid: true, reason: "valid" }
}

/**
 * React hook for processing quick book data from localStorage
 *
 * This hook provides utilities for processing quick book data on-demand
 * rather than automatically, giving components full control over when
 * and how the data is processed.
 *
 * @param options Configuration options for the hook
 * @returns Object containing processing state and utilities
 *
 * @example
 * ```tsx
 * const {
 *   isProcessing,
 *   hasValidData,
 *   processQuickBookData,
 *   clearQuickBookData,
 *   saveCurrentBookingState
 * } = useQuickBookProcessor({
 *   sessions: bookings,
 *   currentStep: state.step,
 *   dispatch,
 *   user: auth.user,
 * })
 *
 * // Process on mount if needed
 * useEffect(() => {
 *   if (hasValidData && currentStep === "play-level") {
 *     processQuickBookData()
 *   }
 * }, [hasValidData, currentStep, processQuickBookData])
 * ```
 */
export const useQuickBookProcessor = <
  TAction extends { type: string; payload?: unknown } = { type: string; payload?: unknown },
>({
  sessions,
  currentStep,
  dispatch,
  user,
  maxAge = DEFAULT_MAX_AGE_MS,
}: UseQuickBookProcessorOptions<TAction>) => {
  const {
    value: quickBookData,
    setValue: setQuickBookData,
    removeValue: clearQuickBookData,
  } = useQuickBookStorage()
  const [, setPlayLevel] = useQueryState(
    "playLevel",
    parseAsStringEnum<PlayLevel>(Object.values(PlayLevel)),
  )

  // Helper function to check if a session is full based on user role
  const isSessionFull = useCallback(
    (
      session: Pick<SessionItem, "capacity" | "casualCapacity" | "attendees" | "casualAttendees">,
    ) => {
      const isCasual = user.role === MembershipType.casual
      return isCasual
        ? session.casualAttendees >= session.casualCapacity
        : session.attendees >= session.capacity
    },
    [user.role],
  )

  // Memoize validation logic to avoid recalculating on every render
  const validationResult = useMemo(
    () => validateQuickBookData(quickBookData, sessions, maxAge, isSessionFull),
    [quickBookData, sessions, maxAge, isSessionFull],
  )

  const processQuickBookData = useCallback(() => {
    if (!validationResult.isValid) {
      // Only clear data for specific reasons that make it permanently invalid
      if (
        validationResult.reason === "expired" ||
        validationResult.reason === "session-not-found" ||
        validationResult.reason === "session-full"
      ) {
        clearQuickBookData()
      }
      return false
    }

    if (!quickBookData?.formData) {
      return false
    }

    // Auto-populate the form with quick book data
    dispatch({ type: "SET_PLAY_LEVEL", payload: quickBookData.formData.skillLevel } as TAction)
    setPlayLevel(quickBookData.formData.skillLevel)

    // Find the matching session and pre-select it
    const matchingSession = sessions.find(
      (session) => session.id === quickBookData.formData.locationAndTimeId,
    )

    if (matchingSession) {
      dispatch({
        type: "SET_BOOKING_TIMES",
        payload: {
          bookingTimes: [matchingSession.id],
        },
      } as TAction)

      // Jump directly to confirmation step to avoid coupling to step count
      dispatch({ type: "JUMP_TO_CONFIRMATION" } as TAction)
    }

    return true
  }, [validationResult, quickBookData, clearQuickBookData, setPlayLevel, dispatch, sessions])

  // Function to save current booking state when moving to next step
  const saveCurrentBookingState = useCallback(
    (playLevel: PlayLevel, bookingTimes: string[]) => {
      if (bookingTimes.length > 0) {
        const selectedSession = sessions.find((session) => session.id === bookingTimes[0])
        if (selectedSession) {
          setQuickBookData({
            formData: {
              locationAndTimeId: selectedSession.id,
              skillLevel: playLevel,
            },
            timestamp: new Date().toISOString(),
          })
        }
      }
    },
    [sessions, setQuickBookData],
  )

  return {
    /**
     * Whether quick book data is currently available and valid
     */
    hasValidData: validationResult.isValid,
    /**
     * Whether quick book data is currently being processed
     */
    isProcessing: validationResult.isValid && currentStep === "play-level",
    /**
     * The reason why the data is invalid (if applicable)
     */
    validationReason: validationResult.reason,
    /**
     * Manually trigger processing of quick book data
     */
    processQuickBookData,
    /**
     * Clear quick book data manually
     */
    clearQuickBookData,
    /**
     * Save current booking state to quick book storage
     */
    saveCurrentBookingState,
    /**
     * Raw quick book data (for debugging or custom processing)
     */
    quickBookData,
  }
}
