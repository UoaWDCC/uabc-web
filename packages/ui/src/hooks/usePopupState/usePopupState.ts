import { isArray, isString } from "@yamada-ui/react"
import { parseAsArrayOf, parseAsString, type UseQueryStatesKeysMap, useQueryStates } from "nuqs"
import { useCallback, useMemo } from "react"

/**
 * Helper type for popup values based on range mode.
 */
export type PopupValue<Multiple extends boolean> = Multiple extends true ? string[] : string

/**
 * Options for configuring the usePopupState hook.
 */
interface UsePopupStateOptions<Multiple extends boolean> {
  /**
   * Unique identifier for the popup (used as a query param key).
   */
  popupId: string
  /**
   * The value representing the open state in the query param. Defaults to 'open'.
   */
  openValue?: string
  /**
   * The key for the value in the query params. Defaults to `${popupId}-value`.
   */
  valueKey?: string
  /**
   * Initial value for the popup state.
   */
  initialValue: PopupValue<Multiple>
  /**
   * If true, the value is treated as an array (multi-value selection). Defaults to false.
   */
  multiple?: Multiple
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: PopupValue<Multiple>) => void
  /**
   * Callback fired when the popup is opened.
   */
  onOpen?: () => void
  /**
   * Callback fired when the popup is closed.
   */
  onClose?: () => void
}

/**
 * Return type for usePopupState hook.
 */
export interface UsePopupStateReturn<Multiple extends boolean> {
  /**
   * Whether the popup is open.
   */
  isOpen: boolean
  /**
   * The current value of the popup.
   */
  value: PopupValue<Multiple>
  /**
   * Opens the popup.
   */
  open: () => void
  /**
   * Closes the popup.
   */
  close: () => void
  /**
   * Toggles the popup open/closed state.
   */
  toggle: () => void
  /**
   * Sets the value of the popup.
   */
  setValue: (value: PopupValue<Multiple>) => void
  /**
   * Clears the value of the popup.
   */
  clearValue: () => void
  /**
   * Navigation functions for managing multiple popups.
   */
  navigation: {
    /**
     * Opens a popup.
     */
    openPopup: (targetPopupId: string) => void
    /**
     * Closes a popup.
     */
    closePopup: (targetPopupId: string) => void
    /**
     * Switches between two popups.
     */
    switchPopup: (fromPopupId: string, toPopupId: string) => void
  }
}

/**
 * React hook for managing the open/close state and value of a popup dialog using URL query parameters.
 *
 * @param options Configuration options for the popup state.
 * @returns An object containing popup state, value, and control functions.
 *
 * @example
 * // Basic usage
 * const popup = usePopupState({
 *   popupId: 'filter',
 *   initialValue: '',
 *   onValueChange: (val) => console.log(val),
 * })
 * // popup.isOpen, popup.value, popup.open(), popup.close(), etc.
 *
 * @remarks
 * This hook synchronizes popup state with URL query parameters, enabling deep linking and browser navigation support for popups.
 */
export function usePopupState<Multiple extends boolean = false>(
  options: UsePopupStateOptions<Multiple>,
): UsePopupStateReturn<Multiple> {
  const {
    popupId,
    openValue = "open",
    valueKey = `${popupId}-value`,
    initialValue,
    multiple = false as Multiple,
    onValueChange,
    onOpen,
    onClose,
  } = options

  const parserConfig = useMemo<UseQueryStatesKeysMap>(() => {
    const config: UseQueryStatesKeysMap = {}
    config[popupId] = parseAsString.withDefault("")

    if (multiple) {
      config[valueKey] = parseAsArrayOf(parseAsString).withDefault(
        isArray(initialValue) ? initialValue : [],
      )
    } else {
      config[valueKey] = parseAsString.withDefault(isString(initialValue) ? initialValue : "")
    }
    return config
  }, [popupId, valueKey, multiple, initialValue])

  const [searchParams, setSearchParams] = useQueryStates(parserConfig, {
    clearOnDefault: true,
  })

  const dialogState = searchParams[popupId]
  const valueParam = searchParams[valueKey] as PopupValue<Multiple>
  const isOpen = dialogState === openValue

  const open = useCallback(() => {
    setSearchParams({ [popupId]: openValue })
    onOpen?.()
  }, [setSearchParams, popupId, openValue, onOpen])

  const close = useCallback(() => {
    setSearchParams({ [popupId]: null })
    onClose?.()
  }, [setSearchParams, popupId, onClose])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  const setValue = useCallback(
    (value: PopupValue<Multiple>) => {
      setSearchParams({ [valueKey]: value })

      // Don't call onValueChange for null values
      if (value === null) {
        return
      }

      // Don't call onValueChange for empty strings in single mode
      if (!multiple && value === "") {
        return
      }

      onValueChange?.(value)
    },
    [setSearchParams, valueKey, onValueChange, multiple],
  )

  const clearValue = useCallback(() => {
    if (multiple) {
      setSearchParams({ [valueKey]: [] })
    } else {
      setSearchParams({ [valueKey]: "" })
    }
  }, [setSearchParams, valueKey, multiple])

  const navigation = useMemo(() => {
    const openPopup = (targetPopupId: string) => {
      setSearchParams({ [targetPopupId]: openValue })
    }
    const closePopup = (targetPopupId: string) => {
      setSearchParams({ [targetPopupId]: null })
    }
    const switchPopup = (fromPopupId: string, toPopupId: string) => {
      setSearchParams({ [fromPopupId]: null, [toPopupId]: openValue })
    }
    return { openPopup, closePopup, switchPopup }
  }, [setSearchParams, openValue])

  return {
    isOpen,
    value: valueParam,
    open,
    close,
    toggle,
    setValue,
    clearValue,
    navigation,
  }
}
