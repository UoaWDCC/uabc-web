import { useMemo } from "react"
import type { ZodSchema, ZodTypeAny } from "zod"
import { Button, type ButtonProps } from "../../Primitive"
import { useCalendarSelectPopupContext, useStepNavigation } from "./CalendarSelectPopupContext"

interface NextButtonProps extends ButtonProps {
  /**
   * Custom callback for next navigation
   * If provided, overrides the default step navigation behavior
   */
  onNext?: () => void

  /**
   * Zod schema for validating the selected date
   */
  schema?: ZodSchema<any> | ZodTypeAny

  /**
   * Custom label for the button
   * @default "Next" or "Finish" for last step
   */
  label?: string

  /**
   * Whether to auto-advance to next step after date selection
   * @default false
   */
  autoAdvance?: boolean
}

export function NextButton({
  onNext,
  schema,
  label,
  autoAdvance = false,
  ...props
}: NextButtonProps) {
  const { selectedDate } = useCalendarSelectPopupContext()
  const stepNavigation = useStepNavigation()

  const { isValid, buttonLabel } = useMemo(() => {
    const dateIsValid = selectedDate
      ? schema
        ? schema.safeParse(selectedDate).success
        : Boolean(selectedDate)
      : false

    const isLastStep = stepNavigation?.currentStep === stepNavigation?.totalSteps
    const defaultLabel = isLastStep ? "Finish" : "Next"

    return {
      isValid: dateIsValid,
      buttonLabel: label || defaultLabel,
    }
  }, [selectedDate, schema, stepNavigation, label])

  const handleClick = () => {
    if (!isValid) return

    if (onNext) {
      onNext()
    } else if (stepNavigation?.onStepChange && stepNavigation.currentStep) {
      // Auto-advance to next step
      const nextStep = stepNavigation.currentStep + 1
      const isLastStep = nextStep > (stepNavigation.totalSteps || 0)

      if (isLastStep) {
        // On last step, close the flow
        stepNavigation.onStepChange(null)
      } else {
        // Go to next step
        stepNavigation.onStepChange(nextStep)
      }
    }
  }

  return (
    <Button colorScheme="primary" disabled={!isValid} onClick={handleClick} {...props}>
      {buttonLabel}
    </Button>
  )
}
