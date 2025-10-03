import type { AdminGameSession } from "@repo/shared"
import type { CalendarProps } from "@yamada-ui/calendar"
import type { ButtonProps, DialogProps } from "@yamada-ui/react"
import type { ReactNode } from "react"

/**
 * Date value type for calendar selection
 * @param T Whether range selection is enabled
 * @returns Date value type
 */
export type DateValue<T extends boolean = false> = T extends true ? [Date?, Date?] : Date | null

/**
 * Extended calendar props for date selection
 * @param T Whether range selection is enabled
 * @returns Extended calendar props
 */
export interface ExtendedCalendarProps<T extends boolean = false>
  extends Omit<CalendarProps, "value" | "onChange"> {
  /**
   * Whether range selection is enabled
   */
  enableRange?: T
  /**
   * The selected date value(s)
   */
  value?: DateValue<T>
  /**
   * Callback when date value(s) change
   */
  onChange?: (value: DateValue<T> | undefined) => void
}

/**
 * Popup configuration interface
 */
export interface PopupConfig {
  /**
   * Unique identifier for this popup instance
   * Used as the search parameter key for popup state
   *
   * @example
   * ```tsx
   * // Different popups with different identifiers
   * <CalendarSelectPopup popupId="date-picker" />
   * <CalendarSelectPopup popupId="event-date" />
   * <CalendarSelectPopup popupId="booking-date" />
   * ```
   */
  popupId: string
  /**
   * Search parameter value that indicates the popup should be open
   * @default "open"
   */
  openValue?: string
  /**
   * Search parameter key for the selected date(s)
   * Defaults to `${popupId}-date`
   */
  dateParamKey?: string
}

/**
 * Close behavior type for multi-step flows
 * - "close": Close the entire popup flow
 * - "back": Go back to previous step
 * - "custom": Use custom onClose handler
 */
export type CloseBehavior = "close" | "back" | "custom"

/**
 * CalendarSelectPopup component props
 * @param T Whether range selection is enabled
 * @returns CalendarSelectPopup component props
 */
export interface CalendarSelectPopupProps<T extends boolean = false> extends PopupConfig {
  /**
   * Override the internal open state management
   * If provided, this will be used instead of the search parameter state
   */
  isOpen?: boolean
  /**
   * Whether to show the trigger button
   * @default false
   */
  showTrigger?: boolean
  /**
   * Current step number for multi-step flows
   */
  currentStep?: number
  /**
   * Total number of steps in the flow
   */
  totalSteps?: number
  /**
   * Whether the popup can be closed
   * @default true
   */
  allowClose?: boolean
  /**
   * Close behavior for multi-step flows
   * - "close": Close the entire popup flow
   * - "back": Go back to previous step
   * - "custom": Use custom onClose handler
   * @default "close"
   */
  closeBehavior?: CloseBehavior
  /**
   * Callback for step navigation
   * @param step The step number to navigate to
   */
  onStepChange?: (step: number | null) => void
  /**
   * Initial date value when no date is selected
   * @default null for single date, [undefined, undefined] for range
   */
  initialDate?: DateValue<T>
  /**
   * Description to display in the dialog
   */
  description?: string
  /**
   * Callback fired when a date or date range is selected
   */
  onDateSelect?: (date: DateValue<T>) => void
  /**
   * Callback fired when the dialog closes
   */
  onClose?: () => void
  /**
   * Callback fired when the dialog opens
   */
  onOpen?: () => void
  /**
   * Calendar component props to customize the calendar
   */
  calendarProps?: ExtendedCalendarProps<T>
  /**
   * Dialog component props to customize the dialog
   */
  dialogProps?: Omit<DialogProps, "open" | "onClose">
  /**
   * Custom title for the dialog
   * @default "Select Date"
   */
  title?: string
  /**
   * Custom trigger element to open the dialog
   * If not provided, a default calendar icon button will be used
   */
  trigger?: ReactNode
  /**
   * Props to pass to the trigger element
   */
  triggerProps?: ButtonProps
  /**
   * Custom content to display in the dialog
   */
  children?: ReactNode
  /**
   * Custom footer content for the dialog
   */
  dialogFooter?: ReactNode
  /**
   * Game sessions to display on the calendar
   * When provided, the calendar becomes session-aware
   */
  gameSessions?: AdminGameSession[]
  /**
   * Whether to show session indicators on the calendar
   * @default true when gameSessions are provided
   */
  showSessionIndicators?: boolean
  /**
   * Whether to disable dates that don't have sessions
   * @default true when gameSessions are provided
   */
  disableInactiveDates?: boolean
}

/**
 * Popup navigation utilities interface
 */
export interface PopupNavigationUtils {
  /**
   * Navigate to open a specific popup
   * @param popupId The popup identifier to open
   * @param options Navigation options
   */
  openPopup: (popupId: string, options?: { replace?: boolean }) => void
  /**
   * Navigate to close a specific popup
   * @param popupId The popup identifier to close
   * @param options Navigation options
   */
  closePopup: (popupId: string, options?: { replace?: boolean }) => void
  /**
   * Navigate to switch from one popup to another
   * @param fromPopupId The current popup to close
   * @param toPopupId The popup to open
   * @param options Navigation options
   */
  switchPopup: (fromPopupId: string, toPopupId: string, options?: { replace?: boolean }) => void
}

/**
 * Return type for useCalendarSelectPopup hook
 * @param T Whether range selection is enabled
 * @returns UseCalendarSelectPopupReturn
 */
export interface UseCalendarSelectPopupReturn<T extends boolean = false> {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean
  /**
   * Currently selected date(s)
   */
  selectedDate: DateValue<T> | null
  /**
   * Function to open the dialog
   */
  open: () => void
  /**
   * Function to close the dialog
   */
  close: () => void
  /**
   * Function to toggle the dialog
   */
  toggle: () => void
  /**
   * Function to set the selected date(s)
   */
  setDate: (date: DateValue<T> | null) => void
  /**
   * Function to clear the selected date(s)
   */
  clearDate: () => void
  /**
   * Function to set date to today (for single date mode)
   */
  setToday: () => void
  /**
   * Navigation utilities for popup management
   */
  navigation: PopupNavigationUtils
}

/**
 * Options for useCalendarSelectPopup hook
 * @param T Whether range selection is enabled
 * @returns UseCalendarSelectPopupOptions
 */
export interface UseCalendarSelectPopupOptions<T extends boolean = false> extends PopupConfig {
  /**
   * Initial date value when no date is selected
   * @default null for single date, [undefined, undefined] for range
   */
  initialDate?: DateValue<T>
  /**
   * Whether range selection is enabled
   */
  enableRange?: T
  /**
   * Callback fired when a date or date range is selected
   */
  onDateSelect?: (date: DateValue<T>) => void
  /**
   * Callback fired when the dialog closes
   */
  onClose?: () => void
  /**
   * Callback fired when the dialog opens
   */
  onOpen?: () => void
}

/**
 * Composite calendar popup props
 * @param T Whether range selection is enabled
 * @returns CompositeCalendarPopupProps
 */
export interface CompositeCalendarPopupProps<T extends boolean = false>
  extends Omit<CalendarSelectPopupProps<T>, "popupId"> {
  /**
   * Optional popup identifier override
   * If not provided, the composite component should use its own default identifier
   */
  popupId?: string
}
