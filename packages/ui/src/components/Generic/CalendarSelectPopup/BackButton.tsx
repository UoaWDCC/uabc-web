import { memo, useMemo } from "react"
import { Button, type ButtonProps } from "../../Primitive/Button"
import { useStepNavigation } from "./CalendarSelectPopupContext"

/**
 * Props for {@link BackButton} component
 */
interface BackButtonProps extends ButtonProps {
  /**
   * Custom label for the button
   * @defaultValue "Back"
   */
  label?: string
  /**
   * Custom callback for back navigation
   * If provided, overrides the default step navigation behavior
   */
  onBack?: () => void
  /**
   * Whether to show the button even on the first step
   * @defaultValue false
   */
  showOnFirstStep?: boolean
}

/**
 * BackButton component for navigating to previous steps in multi-step calendar flows
 *
 * Automatically integrates with the CalendarSelectPopupContext to handle step navigation.
 * The button is hidden by default on the first step and disabled when no previous step exists.
 *
 * @param props BackButton component properties
 * @returns A button component for step navigation, or null if hidden
 *
 * @example
 * ```tsx
 * // Basic usage with automatic step navigation
 * <BackButton />
 *
 * // With custom label and always visible
 * <BackButton label="Previous" showOnFirstStep />
 *
 * // With custom back handler
 * <BackButton onBack={() => console.log("Custom back action")} />
 * ```
 *
 * @remarks
 * The component automatically handles step navigation logic and integrates with
 * the CalendarSelectPopupContext to determine the current step and navigation state.
 */
export const BackButton = memo<BackButtonProps>(
  ({ label = "Back", onBack, showOnFirstStep = false, ...props }) => {
    const stepNavigation = useStepNavigation()

    const { isDisabled, shouldShow } = useMemo(() => {
      if (!stepNavigation) {
        return { isDisabled: true, shouldShow: true }
      }

      const { currentStep } = stepNavigation
      const isFirstStep = currentStep === 1

      return {
        isDisabled: isFirstStep && !onBack,
        shouldShow: showOnFirstStep || !isFirstStep,
      }
    }, [stepNavigation, onBack, showOnFirstStep])

    const handleClick = () => {
      if (onBack) {
        onBack()
      } else if (stepNavigation?.onStepChange && stepNavigation.currentStep) {
        stepNavigation.onStepChange(stepNavigation.currentStep - 1)
      }
    }

    if (!shouldShow) {
      return null
    }

    return (
      <Button colorScheme="secondary" disabled={isDisabled} onClick={handleClick} {...props}>
        {label}
      </Button>
    )
  },
)

BackButton.displayName = "BackButton"
