import { Button, type ButtonProps } from "@repo/ui/components/Primitive"
import { memo, useMemo } from "react"
import type { ZodTypeAny } from "zod"
import { useCalendarSelectPopupContext, useStepNavigation } from "../CalendarSelectPopupContext"

/**
 * Props for {@link NextButton} component
 */
interface NextButtonProps extends ButtonProps {
  /**
   * Custom callback for next navigation
   * If provided, overrides the default step navigation behavior
   */
  onNext?: () => void
  /**
   * Zod schema for validating the selected date
   */
  schema?: ZodTypeAny
  /**
   * Custom label for the button
   * @defaultValue "Next" or "Finish" for last step
   */
  label?: string
  /**
   * Whether to auto-advance to next step after date selection
   * @defaultValue false
   */
  autoAdvance?: boolean
}

/**
 * NextButton component for navigating to next steps in multi-step calendar flows
 *
 * Automatically integrates with the CalendarSelectPopupContext to handle step navigation
 * and date validation. The button is disabled when no valid date is selected and
 * automatically changes label to "Finish" on the last step.
 *
 * @param props NextButton component properties
 * @returns A button component for step navigation with validation
 *
 * @example
 * ```tsx
 * // Basic usage with automatic step navigation
 * <NextButton />
 *
 * // With date validation using Zod schema
 * <NextButton schema={z.date().min(new Date())} />
 *
 * // With custom next handler
 * <NextButton onNext={() => console.log("Custom next action")} />
 *
 * // With custom label
 * <NextButton label="Continue" />
 * ```
 *
 * @remarks
 * The component automatically validates the selected date against the provided schema
 * and handles step navigation logic. It integrates with the CalendarSelectPopupContext
 * to determine the current step and date state.
 */
export const NextButton = memo<NextButtonProps>(
  ({ onNext, schema, label, autoAdvance = false, ...props }) => {
    const { selectedDate } = useCalendarSelectPopupContext()
    const stepNavigation = useStepNavigation()

    const { isValid, buttonLabel } = useMemo(() => {
      const dateIsValid = selectedDate
        ? schema
          ? schema.safeParse(selectedDate).success
          : Boolean(selectedDate)
        : false

      const isLastStep =
        !!stepNavigation && stepNavigation.currentStep === stepNavigation.totalSteps
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
        const nextStep = stepNavigation.currentStep + 1
        const isLastStep = nextStep > (stepNavigation.totalSteps || 0)

        if (isLastStep) {
          stepNavigation.onStepChange(null)
        } else {
          stepNavigation.onStepChange(nextStep)
        }
      }
    }

    return (
      <Button colorScheme="primary" disabled={!isValid} onClick={handleClick} {...props}>
        {buttonLabel}
      </Button>
    )
  },
)

NextButton.displayName = "NextButton"
