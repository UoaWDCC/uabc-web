import { useMemo } from "react"
import { Button, type ButtonProps } from "../../Primitive"
import { useStepNavigation } from "./CalendarSelectPopupContext"

interface BackButtonProps extends ButtonProps {
  /**
   * Custom label for the button
   * @default "Back"
   */
  label?: string

  /**
   * Custom callback for back navigation
   * If provided, overrides the default step navigation behavior
   */
  onBack?: () => void

  /**
   * Whether to show the button even on the first step
   * @default false
   */
  showOnFirstStep?: boolean
}

export function BackButton({
  label = "Back",
  onBack,
  showOnFirstStep = false,
  ...props
}: BackButtonProps) {
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

  if (!shouldShow) return null

  return (
    <Button colorScheme="secondary" disabled={isDisabled} onClick={handleClick} {...props}>
      {label}
    </Button>
  )
}
