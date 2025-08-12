import { QuickBookLocalStorageSchema } from "@repo/shared"
import { useLocalStorage } from "./localStorageManager"

const QUICK_BOOK_STORAGE_KEY = "quick_book_data"

/**
 * React hook for managing quick book form data in localStorage
 *
 * This hook provides a way to persist quick book form data across sessions
 * with schema validation and automatic cleanup of expired data.
 *
 * @returns Object containing quick book data, setter, and utility functions
 *
 * @example
 * ```tsx
 * const { value: quickBookData, setValue: setQuickBookData, removeValue } = useQuickBookStorage()
 *
 * // Save quick book data
 * setQuickBookData({
 *   formData: { locationAndTimeId: "123", skillLevel: PlayLevel.beginner },
 *   timestamp: new Date().toISOString()
 * })
 *
 * // Clear quick book data
 * removeValue()
 * ```
 */
export const useQuickBookStorage = () => {
  return useLocalStorage(QUICK_BOOK_STORAGE_KEY, QuickBookLocalStorageSchema)
}
