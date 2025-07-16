import { render, screen } from "@repo/ui/test-utils"
import {
  CalendarSelectPopupContext,
  type CalendarSelectPopupContextValue,
  useCalendarSelectPopupContext,
  useStepNavigation,
} from "./CalendarSelectPopupContext"

const TestComponent = () => {
  const { selectedDate, setDate } = useCalendarSelectPopupContext()
  return (
    <div>
      <div>Selected: {selectedDate?.toDateString() || "None"}</div>
      <button onClick={() => setDate(new Date("2024-01-01"))} type="button">
        Set Date
      </button>
    </div>
  )
}

const StepNavigationTestComponent = () => {
  const stepNavigation = useStepNavigation()
  return (
    <div>
      <div>Step: {stepNavigation?.currentStep || "None"}</div>
      <button onClick={() => stepNavigation?.onStepChange?.(2)} type="button">
        Next Step
      </button>
    </div>
  )
}

const ComponentWithoutContext = () => {
  useCalendarSelectPopupContext()
  return <div>Should not render</div>
}

describe("CalendarSelectPopupContext", () => {
  it("should provide context values to children", () => {
    const mockContext: CalendarSelectPopupContextValue = {
      selectedDate: new Date("2024-01-01"),
      setDate: vi.fn(),
    }

    render(
      <CalendarSelectPopupContext.Provider value={mockContext}>
        <TestComponent />
      </CalendarSelectPopupContext.Provider>,
    )

    expect(screen.getByText("Selected: Mon Jan 01 2024")).toBeInTheDocument()
  })

  it("should call setDate when button is clicked", async () => {
    const mockSetDate = vi.fn()
    const mockContext: CalendarSelectPopupContextValue = {
      selectedDate: null,
      setDate: mockSetDate,
    }

    const { user } = render(
      <CalendarSelectPopupContext.Provider value={mockContext}>
        <TestComponent />
      </CalendarSelectPopupContext.Provider>,
    )

    await user.click(screen.getByRole("button", { name: "Set Date" }))
    expect(mockSetDate).toHaveBeenCalledWith(new Date("2024-01-01"))
  })

  it("should provide step navigation context", () => {
    const mockContext: CalendarSelectPopupContextValue = {
      selectedDate: null,
      setDate: vi.fn(),
      stepNavigation: {
        currentStep: 1,
        totalSteps: 3,
        onStepChange: vi.fn(),
      },
    }

    render(
      <CalendarSelectPopupContext.Provider value={mockContext}>
        <StepNavigationTestComponent />
      </CalendarSelectPopupContext.Provider>,
    )

    expect(screen.getByText("Step: 1")).toBeInTheDocument()
  })

  it("should handle step navigation without context", () => {
    const mockContext: CalendarSelectPopupContextValue = {
      selectedDate: null,
      setDate: vi.fn(),
    }

    render(
      <CalendarSelectPopupContext.Provider value={mockContext}>
        <StepNavigationTestComponent />
      </CalendarSelectPopupContext.Provider>,
    )

    expect(screen.getByText("Step: None")).toBeInTheDocument()
  })

  it("should call onStepChange when step navigation is used", async () => {
    const mockOnStepChange = vi.fn()
    const mockContext: CalendarSelectPopupContextValue = {
      selectedDate: null,
      setDate: vi.fn(),
      stepNavigation: {
        currentStep: 1,
        totalSteps: 3,
        onStepChange: mockOnStepChange,
      },
    }

    const { user } = render(
      <CalendarSelectPopupContext.Provider value={mockContext}>
        <StepNavigationTestComponent />
      </CalendarSelectPopupContext.Provider>,
    )

    await user.click(screen.getByRole("button", { name: "Next Step" }))
    expect(mockOnStepChange).toHaveBeenCalledWith(2)
  })

  it("should throw error when useCalendarSelectPopupContext is used outside provider", () => {
    const originalError = console.error
    console.error = vi.fn()

    expect(() => {
      render(<ComponentWithoutContext />)
    }).toThrow(
      "useCalendarSelectPopupContext must be used within CalendarSelectPopupContext.Provider",
    )
    console.error = originalError
  })
})
