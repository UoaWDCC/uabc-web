import { fireEvent, render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as PinInputModule from "./index"
import { PinInput } from "./PinInput"

describe("<PinInput />", () => {
  it("should re-export the PinInput component and check if PinInput exists", () => {
    expect(PinInputModule.PinInput).toBeDefined()
    expect(isValidElement(<PinInputModule.PinInput />)).toBeTruthy()
  })

  it("renders with basic props", () => {
    render(<PinInput items={4} label="Verification Code" />)
    expect(screen.getByText("Verification Code")).toBeInTheDocument()
  })

  describe("Ref merging behavior", () => {
    it("forwards ref correctly when no registration is provided", () => {
      const ref = { current: null }
      render(<PinInput items={4} ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it("merges registration ref with component ref when both are provided", () => {
      const componentRef = { current: null }
      const registrationRef = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: registrationRef,
      }

      render(<PinInput items={4} ref={componentRef} registration={mockRegistration} />)

      expect(registrationRef).toHaveBeenCalled()
      expect(componentRef.current).toBeInstanceOf(HTMLDivElement)
    })

    it("uses registration ref when registration ref is provided but component ref is not", () => {
      const registrationRef = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: registrationRef,
      }

      render(<PinInput items={4} registration={mockRegistration} />)
      expect(registrationRef).toHaveBeenCalled()
    })

    it("falls back to component ref when registration ref is null", () => {
      const componentRef = { current: null }
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: null,
        // biome-ignore lint/suspicious/noExplicitAny: fallback behavior
      } as any

      render(<PinInput items={4} ref={componentRef} registration={mockRegistration} />)
      expect(componentRef.current).toBeInstanceOf(HTMLDivElement)
    })

    it("falls back to component ref when registration ref is undefined", () => {
      const componentRef = { current: null }
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: undefined,
        // biome-ignore lint/suspicious/noExplicitAny: fallback behavior
      } as any

      render(<PinInput items={4} ref={componentRef} registration={mockRegistration} />)
      expect(componentRef.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe("onChange handler merging", () => {
    it("calls both component onChange and registration onChange when both are provided", () => {
      const componentOnChange = vi.fn()
      const registrationOnChange = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: registrationOnChange,
        onBlur: vi.fn(),
        ref: vi.fn(),
      }

      render(<PinInput items={4} onChange={componentOnChange} registration={mockRegistration} />)

      const input = screen.getByRole("group").children[0]
      fireEvent.change(input, { target: { value: "1" } })

      expect(componentOnChange).toHaveBeenCalled()
      expect(registrationOnChange).toHaveBeenCalledWith({ target: { value: "1" } })
    })

    it("calls only component onChange when registration onChange is not provided", () => {
      const componentOnChange = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onBlur: vi.fn(),
        ref: vi.fn(),
        // No onChange in registration
        // biome-ignore lint/suspicious/noExplicitAny: fallback behavior
      } as any

      render(<PinInput items={4} onChange={componentOnChange} registration={mockRegistration} />)

      const input = screen.getByRole("group").children[0]
      fireEvent.change(input, { target: { value: "1" } })

      expect(componentOnChange).toHaveBeenCalled()
    })

    it("calls only registration onChange when component onChange is not provided", () => {
      const registrationOnChange = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: registrationOnChange,
        onBlur: vi.fn(),
        ref: vi.fn(),
      }

      render(<PinInput items={4} registration={mockRegistration} />)

      const input = screen.getByRole("group").children[0]
      fireEvent.change(input, { target: { value: "1" } })

      expect(registrationOnChange).toHaveBeenCalledWith({ target: { value: "1" } })
    })

    it("transforms registration onChange parameter correctly", () => {
      const registrationOnChange = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: registrationOnChange,
        onBlur: vi.fn(),
        ref: vi.fn(),
      }

      render(<PinInput items={4} registration={mockRegistration} />)

      const input = screen.getByRole("group").children[0]
      fireEvent.change(input, { target: { value: "123" } })

      // The onChange should be called with a transformed event-like object
      expect(registrationOnChange).toHaveBeenCalledWith({ target: { value: "123" } })
    })

    it("handles undefined registration onChange gracefully", () => {
      const componentOnChange = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: undefined,
        onBlur: vi.fn(),
        ref: vi.fn(),
        // biome-ignore lint/suspicious/noExplicitAny: fallback behavior
      } as any

      render(<PinInput items={4} onChange={componentOnChange} registration={mockRegistration} />)

      const input = screen.getByRole("group").children[0]
      fireEvent.change(input, { target: { value: "1" } })

      expect(componentOnChange).toHaveBeenCalled()
    })
  })

  describe("Error handling", () => {
    it("displays error message when isError is true", () => {
      render(
        <PinInput
          errorMessage="Invalid verification code"
          isError={true}
          items={4}
          label="OTP Code"
        />,
      )
      expect(screen.getByText("Invalid verification code")).toBeInTheDocument()
    })
  })
})
