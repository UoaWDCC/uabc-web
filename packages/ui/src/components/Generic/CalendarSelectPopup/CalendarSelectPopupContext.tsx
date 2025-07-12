import { createContext, useContext } from "react"
import type { CloseBehavior, DateValue } from "./types"

export interface StepNavigationContext {
  currentStep?: number
  totalSteps?: number
  onStepChange?: (step: number | null) => void
  allowClose?: boolean
  closeBehavior?: CloseBehavior
}

export interface CalendarSelectPopupContextValue<T extends boolean = false> {
  selectedDate: DateValue<T> | null
  setDate: (date: DateValue<T> | null) => void
  stepNavigation?: StepNavigationContext
}

export const CalendarSelectPopupContext = createContext<
  CalendarSelectPopupContextValue<any> | undefined
>(undefined)

export function useCalendarSelectPopupContext<T extends boolean = false>() {
  const ctx = useContext(CalendarSelectPopupContext)
  if (!ctx)
    throw new Error(
      "useCalendarSelectPopupContext must be used within CalendarSelectPopupContext.Provider",
    )
  return ctx as CalendarSelectPopupContextValue<T>
}

export function useStepNavigation() {
  const ctx = useCalendarSelectPopupContext()
  return ctx.stepNavigation
}
