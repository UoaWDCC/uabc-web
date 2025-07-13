import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { vi } from "vitest"
import { z } from "zod"
import {
  CalendarSelectPopupContext,
  type CalendarSelectPopupContextValue,
} from "./CalendarSelectPopupContext"
import { NextButton } from "./NextButton"

const renderNextButton = (
  props: React.ComponentProps<typeof NextButton>,
  context: Partial<CalendarSelectPopupContextValue>,
) => {
  const mockContext: CalendarSelectPopupContextValue = {
    selectedDate: null,
    setDate: vi.fn(),
    stepNavigation: undefined,
    ...context,
  }

  return render(
    <CalendarSelectPopupContext.Provider value={mockContext}>
      <NextButton {...props} />
    </CalendarSelectPopupContext.Provider>,
  )
}

describe("<NextButton />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<NextButton />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(NextButton.displayName).toBe("NextButton")
  })

  it("should be disabled when no date is selected", () => {
    renderNextButton({}, { selectedDate: null })
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("should be disabled when date is invalid according to schema", () => {
    renderNextButton(
      { schema: z.date().min(new Date(2025, 0, 1)) },
      { selectedDate: new Date(2024, 0, 1) },
    )
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("should be enabled when date is selected and no schema is provided", () => {
    renderNextButton({}, { selectedDate: new Date() })
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled()
  })

  it("should be enabled when date is valid according to schema", () => {
    renderNextButton(
      { schema: z.date().max(new Date(2025, 0, 1)) },
      { selectedDate: new Date(2024, 0, 1) },
    )
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled()
  })

  it('should display "Next" by default', () => {
    renderNextButton({}, { selectedDate: new Date() })
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it('should display "Finish" on the last step', () => {
    renderNextButton(
      {},
      {
        selectedDate: new Date(),
        stepNavigation: { currentStep: 3, totalSteps: 3 },
      },
    )
    expect(screen.getByRole("button", { name: "Finish" })).toBeInTheDocument()
  })

  it("should call onStepChange with next step when clicked", async () => {
    const onStepChange = vi.fn()
    const { user } = renderNextButton(
      {},
      {
        selectedDate: new Date(),
        stepNavigation: { currentStep: 1, totalSteps: 3, onStepChange },
      },
    )

    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(onStepChange).toHaveBeenCalledWith(2)
  })

  it("should call onStepChange with null when finishing", async () => {
    const onStepChange = vi.fn()
    const { user } = renderNextButton(
      {},
      {
        selectedDate: new Date(),
        stepNavigation: { currentStep: 3, totalSteps: 3, onStepChange },
      },
    )

    await user.click(screen.getByRole("button", { name: "Finish" }))
    expect(onStepChange).toHaveBeenCalledWith(null)
  })

  it("should call onNext when clicked if provided", async () => {
    const onNext = vi.fn()
    const onStepChange = vi.fn()
    const { user } = renderNextButton(
      { onNext },
      {
        selectedDate: new Date(),
        stepNavigation: { currentStep: 1, totalSteps: 3, onStepChange },
      },
    )

    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(onNext).toHaveBeenCalled()
    expect(onStepChange).not.toHaveBeenCalled()
  })

  it("should work without step navigation context", () => {
    renderNextButton({}, { selectedDate: new Date() })
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled()
  })

  it("should use custom label when provided", () => {
    renderNextButton({ label: "Continue" }, { selectedDate: new Date() })
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("should handle edge case when currentStep is undefined", () => {
    renderNextButton(
      {},
      {
        selectedDate: new Date(),
        stepNavigation: { onStepChange: vi.fn(), totalSteps: 3 },
      },
    )
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled()
  })

  it("should handle early return when date is invalid (line 84)", () => {
    const onNext = vi.fn()
    const onStepChange = vi.fn()
    renderNextButton(
      { onNext },
      {
        selectedDate: null,
        stepNavigation: { currentStep: 1, totalSteps: 3, onStepChange },
      },
    )

    const button = screen.getByRole("button", { name: "Next" })
    button.click()

    expect(onNext).not.toHaveBeenCalled()
    expect(onStepChange).not.toHaveBeenCalled()
  })

  it("should handle click when stepNavigation currentStep is falsy", () => {
    const onStepChange = vi.fn()
    renderNextButton(
      {},
      {
        selectedDate: new Date(),
        stepNavigation: { currentStep: 0, totalSteps: 3, onStepChange },
      },
    )

    const button = screen.getByRole("button", { name: "Next" })
    button.click()

    expect(onStepChange).not.toHaveBeenCalled()
  })

  it("should handle isLastStep calculation when totalSteps is undefined", () => {
    const onStepChange = vi.fn()
    renderNextButton(
      {},
      {
        selectedDate: new Date(),
        stepNavigation: { currentStep: 1, onStepChange },
      },
    )

    const button = screen.getByRole("button", { name: "Next" })
    button.click()

    expect(onStepChange).toHaveBeenCalledWith(null)
  })
})
