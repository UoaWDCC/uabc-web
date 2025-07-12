import type { CompositeCalendarPopupProps, PopupConfig } from "./types"

export function createPopupConfig(baseId: string, suffix?: string): PopupConfig {
  const popupId = suffix ? `${baseId}-${suffix}` : baseId
  return {
    popupId,
    openValue: "open",
    dateParamKey: `${popupId}-date`,
  }
}

export function createCompositeProps<T extends boolean = false>(
  baseId: string,
  props: CompositeCalendarPopupProps<T> = {} as CompositeCalendarPopupProps<T>,
): CompositeCalendarPopupProps<T> & PopupConfig {
  const popupId = props.popupId || baseId
  const config = createPopupConfig(popupId)

  return {
    ...config,
    ...props,
    popupId,
  }
}

export const NavigationPatterns = {
  sequential: {
    next: (current: string, next: string, navigation: any) => {
      navigation.switchPopup(current, next)
    },

    previous: (current: string, previous: string, navigation: any) => {
      navigation.switchPopup(current, previous)
    },
  },

  conditional: {
    navigate: (
      current: string,
      condition: boolean,
      trueTarget: string,
      falseTarget: string,
      navigation: any,
    ) => {
      const target = condition ? trueTarget : falseTarget
      navigation.switchPopup(current, target)
    },
  },

  form: {
    nextStep: (current: string, next: string, isValid: () => boolean, navigation: any): boolean => {
      if (isValid()) {
        navigation.switchPopup(current, next)
        return true
      }
      return false
    },
  },
}
