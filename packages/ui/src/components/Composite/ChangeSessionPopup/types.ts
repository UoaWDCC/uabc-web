import type { AdminGameSession } from "@repo/shared"
import type { CalendarSelectPopupProps } from "@repo/ui/components/Generic/CalendarSelectPopup"

/**
 * Props for the ChangeSessionPopup component
 */
export interface ChangeSessionPopupProps
  extends Omit<CalendarSelectPopupProps, "children" | "popupId"> {
  /**
   * Whether the popup is currently open
   */
  isOpen: boolean
  /**
   * Callback fired when the popup is closed
   */
  onClose?: () => void
  /**
   * Array of available game sessions to choose from
   */
  availableSessions?: AdminGameSession[]
  /**
   * Currently selected date
   */
  selectedDate?: Date | null
  /**
   * Current session being viewed/changed
   */
  currentSession?: AdminGameSession | null
  /**
   * Callback fired when the user confirms the session change
   * @param session The selected session to change to
   */
  onConfirm?: (session: AdminGameSession) => void
  /**
   * Callback fired when a date is selected
   * @param date The selected date
   */
  onDateSelect?: (date: Date | null) => void
  /**
   * Whether the confirm button is in loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Custom title for the popup
   * @default "Change Session"
   */
  title?: string
  /**
   * Custom description for the popup
   * @default "Select a new date to view available sessions"
   */
  description?: string
  /**
   * Custom popup identifier
   * @default "change-session"
   */
  popupId?: string
}
