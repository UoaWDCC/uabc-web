import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { vi } from "vitest"
import {
  CalendarSelectPopupContext,
  type CalendarSelectPopupContextValue,
} from "../CalendarSelectPopupContext"
import { BackButton } from "./BackButton"

const renderBackButton = (
  props: React.ComponentProps<typeof BackButton>,
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
      <BackButton {...props} />
    </CalendarSelectPopupContext.Provider>,
  )
}

describe("<BackButton />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<BackButton />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(BackButton.displayName).toBe("BackButton")
  })

  it("should not render on first step by default", () => {
    renderBackButton(
      {},
      {
        stepNavigation: {
          currentStep: 1,
        },
      },
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("should render on first step if showOnFirstStep is true", () => {
    renderBackButton(
      { showOnFirstStep: true },
      {
        stepNavigation: {
          currentStep: 1,
        },
      },
    )
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument()
  })

  it("should be disabled on first step if showOnFirstStep is true and no onBack handler", () => {
    renderBackButton(
      { showOnFirstStep: true },
      {
        stepNavigation: {
          currentStep: 1,
        },
      },
    )
    expect(screen.getByRole("button", { name: /Back/i })).toBeDisabled()
  })

  it("should be enabled on first step if showOnFirstStep is true and onBack handler is provided", () => {
    renderBackButton(
      { showOnFirstStep: true, onBack: vi.fn() },
      {
        stepNavigation: {
          currentStep: 1,
        },
      },
    )
    expect(screen.getByRole("button", { name: /Back/i })).toBeEnabled()
  })

  it("should render on step > 1", () => {
    renderBackButton(
      {},
      {
        stepNavigation: {
          currentStep: 2,
        },
      },
    )
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Back/i })).toBeEnabled()
  })

  it("should call onStepChange when clicked", async () => {
    const onStepChange = vi.fn()
    const { user } = renderBackButton(
      {},
      {
        stepNavigation: {
          currentStep: 2,
          onStepChange,
        },
      },
    )

    await user.click(screen.getByRole("button", { name: /Back/i }))
    expect(onStepChange).toHaveBeenCalledWith(1)
  })

  it("should call onBack when clicked if provided", async () => {
    const onBack = vi.fn()
    const onStepChange = vi.fn()
    const { user } = renderBackButton(
      { onBack },
      {
        stepNavigation: {
          currentStep: 2,
          onStepChange,
        },
      },
    )

    await user.click(screen.getByRole("button", { name: /Back/i }))
    expect(onBack).toHaveBeenCalled()
    expect(onStepChange).not.toHaveBeenCalled()
  })

  it("should be disabled when no step navigation context is provided", () => {
    renderBackButton({}, {})
    expect(screen.getByRole("button", { name: /Back/i })).toBeDisabled()
  })

  it("should be disabled when no step navigation context even with onBack provided", () => {
    const onBack = vi.fn()
    renderBackButton({ onBack }, {})
    expect(screen.getByRole("button", { name: /Back/i })).toBeDisabled()
  })

  it("should handle click when stepNavigation exists but currentStep is falsy", async () => {
    const onStepChange = vi.fn()
    const { user } = renderBackButton(
      {},
      {
        stepNavigation: {
          currentStep: 0,
          onStepChange,
        },
      },
    )

    await user.click(screen.getByRole("button", { name: /Back/i }))
    expect(onStepChange).not.toHaveBeenCalled()
  })

  it("should handle click when stepNavigation exists but currentStep is undefined", async () => {
    const onStepChange = vi.fn()
    const { user } = renderBackButton(
      {},
      {
        stepNavigation: {
          currentStep: undefined,
          onStepChange,
        },
      },
    )

    await user.click(screen.getByRole("button", { name: /Back/i }))
    expect(onStepChange).not.toHaveBeenCalled()
  })
})
