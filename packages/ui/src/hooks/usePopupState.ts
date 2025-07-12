import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { useCallback, useMemo } from "react"

interface UsePopupStateOptions<T> {
  popupId: string
  openValue?: string
  valueKey?: string
  initialValue: T
  isRange?: boolean
  onValueChange?: (value: T) => void
  onOpen?: () => void
  onClose?: () => void
}

export function usePopupState<T = any>({
  popupId,
  openValue = "open",
  valueKey = `${popupId}-value`,
  initialValue,
  isRange = false,
  onValueChange,
  onOpen,
  onClose,
}: UsePopupStateOptions<T>) {
  const parserConfig = useMemo(() => {
    const config: Record<string, any> = {}
    config[popupId] = parseAsString.withDefault("")
    if (isRange) {
      config[valueKey] = parseAsArrayOf(parseAsString).withDefault([])
    } else {
      config[valueKey] = parseAsString.withDefault("")
    }
    return config
  }, [popupId, valueKey, isRange])

  const [searchParams, setSearchParams] = useQueryStates(parserConfig, {
    clearOnDefault: true,
  })

  const dialogState = searchParams[popupId]
  const valueParam = searchParams[valueKey] as T
  const isOpen = useMemo(() => dialogState === openValue, [dialogState, openValue])

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
    (value: T | null) => {
      if (isRange) {
        setSearchParams({ [valueKey]: value || [] })
        if (value) onValueChange?.(value)
      } else {
        setSearchParams({ [valueKey]: value || null })
        if (value) onValueChange?.(value)
      }
    },
    [setSearchParams, valueKey, onValueChange, isRange],
  )

  const clearValue = useCallback(() => {
    if (isRange) {
      setSearchParams({ [valueKey]: [] })
    } else {
      setSearchParams({ [valueKey]: null })
    }
  }, [setSearchParams, valueKey, isRange])

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
