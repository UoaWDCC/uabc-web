"use client"
import { createContext, useContext } from "react"
import type { CloseBehavior, DateValue } from "./types"

/**
 * Context for managing step navigation in multi-step calendar flows
 */
export interface StepNavigationContext {
  /**
   * The current step number
   */
  currentStep?: number
  /**
   * The total number of steps
   */
  totalSteps?: number
  /**
   * Callback function to handle step changes
   */
  onStepChange?: (step: number | null) => void
  /**
   * Whether the popup can be closed
   */
  allowClose?: boolean
  /**
   * The behavior when the popup is closed
   */
  closeBehavior?: CloseBehavior
}

/**
 * Context value containing calendar state and step navigation
 */
export interface CalendarSelectPopupContextValue<T extends boolean = false> {
  /**
   * The selected date or date range
   */
  selectedDate: DateValue<T> | null
  /**
   * Function to set the selected date or date range
   */
  setDate: (date: DateValue<T> | null) => void
  /**
   * Step navigation context
   */
  stepNavigation?: StepNavigationContext
}

/**
 * React context for sharing calendar state between components
 */
export const CalendarSelectPopupContext = createContext<
  CalendarSelectPopupContextValue<boolean> | undefined
>(undefined)

/**
 * Hook to access calendar popup context
 *
 * @returns Calendar popup context value with date state and navigation functions
 * @throws Error if used outside of CalendarSelectPopupContext.Provider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { selectedDate, setDate } = useCalendarSelectPopupContext()
 *   return <div>Selected: {selectedDate?.toString()}</div>
 * }
 * ```
 */
export function useCalendarSelectPopupContext<T extends boolean = false>() {
  const ctx = useContext(CalendarSelectPopupContext)
  if (!ctx)
    throw new Error(
      "useCalendarSelectPopupContext must be used within CalendarSelectPopupContext.Provider",
    )
  return ctx as CalendarSelectPopupContextValue<T>
}

/**
 * Hook to access step navigation context
 *
 * @returns Step navigation context for multi-step flows, or undefined if not in a multi-step flow
 *
 * @example
 * ```tsx
 * function NavigationButton() {
 *   const stepNavigation = useStepNavigation()
 *   if (!stepNavigation) return null
 *
 *   return (
 *     <Button onClick={() => stepNavigation.onStepChange?.(2)}>
 *       Next Step
 *     </Button>
 *   )
 * }
 * ```
 */
export function useStepNavigation() {
  const ctx = useCalendarSelectPopupContext()
  return ctx.stepNavigation
}
