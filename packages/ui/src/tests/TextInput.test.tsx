import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { InputType, TextInput } from "../components/TextInput/TextInput"

describe("TextInput Component", () => {
  it("renders input with label", () => {
    render(<TextInput label="Test Label" />)
    const label = screen.getByText("Test Label")
    const input = screen.getByLabelText("Test Label")

    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it("renders different input types", () => {
    const types = [InputType.Text, InputType.Email, InputType.Password, InputType.Number]

    for (const type of types) {
      const { unmount } = render(<TextInput label={`${type} Input`} type={type} />)
      const input = screen.getByLabelText(`${type} Input`) as HTMLInputElement

      expect(input.type).toBe(type)
      unmount()
    }
  })

  it("handles password visibility toggle", () => {
    render(<TextInput label="Password" type={InputType.Password} />)
    const input = screen.getByLabelText("Password") as HTMLInputElement
    const toggleButton = screen.getByRole("button")

    // Initially password type
    expect(input.type).toBe("password")

    // Toggle to show password
    fireEvent.click(toggleButton)
    expect(input.type).toBe("text")

    // Toggle back to hide password
    fireEvent.click(toggleButton)
    expect(input.type).toBe("password")
  })

  it("displays error state", () => {
    render(<TextInput errorMessage="Test error message" isError label="Error Input" />)

    const input = screen.getByLabelText("Error Input")
    const errorMessage = screen.getByText("Test error message")

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(errorMessage).toBeInTheDocument()
  })

  it("handles disabled state", () => {
    render(<TextInput disabled label="Disabled Input" />)
    const input = screen.getByLabelText("Disabled Input")

    expect(input).toBeDisabled()
  })

  it("passes through additional props", () => {
    render(
      <TextInput data-testid="test-input" label="Props Input" placeholder="Test Placeholder" />,
    )

    const input = screen.getByTestId("test-input")
    expect(input).toHaveAttribute("placeholder", "Test Placeholder")
  })
})
