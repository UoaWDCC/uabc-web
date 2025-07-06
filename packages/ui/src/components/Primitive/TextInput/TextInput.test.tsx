import { fireEvent, render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { InputType, TextInput } from "."
import * as TextInputModule from "./index"

describe("<TextInput />", () => {
  it("should re-export the TextInput component and check if TextInput exists", () => {
    expect(TextInputModule.TextInput).toBeDefined()

    expect(isValidElement(<TextInputModule.TextInput />)).toBeTruthy()
  })

  it("renders with label", () => {
    render(<TextInput label="Username" type={InputType.Text} />)
    expect(screen.getByText("Username")).toBeInTheDocument()
  })

  it("handles password visibility toggle", () => {
    render(<TextInput placeholder="Enter password" type={InputType.Password} />)
    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement
    const toggleButton = screen.getByRole("button")

    expect(input.type).toBe("password")
    fireEvent.click(toggleButton)
    expect(input.type).toBe("text")
    fireEvent.click(toggleButton)
    expect(input.type).toBe("password")
  })

  it("displays error message when invalid", () => {
    render(
      <TextInput
        errorMessage="Invalid email format"
        isError={true}
        label="Email"
        type={InputType.Text}
      />,
    )
    expect(screen.getByText("Invalid email format")).toBeInTheDocument()
  })

  it("handles disabled state", () => {
    render(<TextInput disabled placeholder="Disabled input" type={InputType.Text} />)
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled()
  })

  it("forwards ref correctly", () => {
    const ref = { current: null }
    render(<TextInput ref={ref} type={InputType.Text} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("applies custom styles and props", () => {
    render(
      <TextInput
        data-testid="custom-input"
        placeholder="Custom input"
        type={InputType.Text}
        width="300px"
      />,
    )
    expect(screen.getByTestId("custom-input")).toHaveStyle({ width: "300px" })
  })

  it("handles input value changes", () => {
    render(<TextInput placeholder="Enter text" type={InputType.Text} />)
    const input = screen.getByPlaceholderText("Enter text")
    fireEvent.change(input, { target: { value: "Test value" } })
    expect(input).toHaveValue("Test value")
  })

  it("handles default text input type", () => {
    render(<TextInput data-testid="default-input" label="Default Input" />)
    expect(screen.getByTestId("default-input")).toHaveAttribute("type", "text")
  })

  it("renders endIcon when provided", () => {
    const endIcon = <span data-testid="end-icon">★</span>
    render(
      <TextInput
        data-testid="input-with-end-icon"
        endIcon={endIcon}
        label="Input with End Icon"
        type={InputType.Text}
      />,
    )

    expect(screen.getByTestId("end-icon")).toBeInTheDocument()
    expect(screen.getByText("★")).toBeInTheDocument()
  })

  it("prioritizes endIcon over password toggle when both could be rendered", () => {
    const endIcon = <span data-testid="end-icon">★</span>
    render(
      <TextInput
        data-testid="password-with-end-icon"
        endIcon={endIcon}
        type={InputType.Password}
      />,
    )

    expect(screen.getByTestId("end-icon")).toBeInTheDocument()

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders no right element when neither endIcon nor password type", () => {
    render(<TextInput data-testid="text-input-no-icons" type={InputType.Text} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  describe("React Hook Form integration", () => {
    it("applies registration props when registration is provided", () => {
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      }

      render(
        <TextInput
          data-testid="registered-input"
          placeholder="Registered input"
          registration={mockRegistration}
          type={InputType.Text}
        />,
      )

      const input = screen.getByTestId("registered-input")
      expect(input).toHaveAttribute("name", "test-field")

      fireEvent.change(input, { target: { value: "test" } })
      expect(mockRegistration.onChange).toHaveBeenCalled()

      fireEvent.blur(input)
      expect(mockRegistration.onBlur).toHaveBeenCalled()
    })

    it("uses registration ref when provided", () => {
      const registrationRef = vi.fn()
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: registrationRef,
      }

      render(
        <TextInput
          data-testid="registered-input-with-ref"
          registration={mockRegistration}
          type={InputType.Text}
        />,
      )

      expect(registrationRef).toHaveBeenCalled()
    })

    it("falls back to component ref when registration ref is not provided", () => {
      const componentRef = { current: null }
      const mockRegistration = {
        name: "test-field",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      }

      render(<TextInput ref={componentRef} registration={mockRegistration} type={InputType.Text} />)

      expect(componentRef.current).toBeInstanceOf(HTMLInputElement)
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

      render(<TextInput ref={componentRef} registration={mockRegistration} type={InputType.Text} />)

      expect(componentRef.current).toBeInstanceOf(HTMLInputElement)
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

      render(<TextInput ref={componentRef} registration={mockRegistration} type={InputType.Text} />)

      expect(componentRef.current).toBeInstanceOf(HTMLInputElement)
    })

    it("applies component props without registration when registration is not provided", () => {
      const onChange = vi.fn()
      const onBlur = vi.fn()

      render(
        <TextInput
          data-testid="non-registered-input"
          name="manual-field"
          onBlur={onBlur}
          onChange={onChange}
          placeholder="Non-registered input"
          type={InputType.Text}
        />,
      )

      const input = screen.getByTestId("non-registered-input")
      expect(input).toHaveAttribute("name", "manual-field")

      fireEvent.change(input, { target: { value: "test" } })
      expect(onChange).toHaveBeenCalled()

      fireEvent.blur(input)
      expect(onBlur).toHaveBeenCalled()
    })
  })
})
