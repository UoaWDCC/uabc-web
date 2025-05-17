import { fireEvent, render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { InputType, TextInput } from "./TextInput"
import * as TextInputModule from "./index"

describe("<TextInput />", () => {
  it("should re-export the TextInput component", () => {
    expect(TextInputModule.TextInput).toBeDefined() // Check if TextInput exists

    expect(isValidElement(<TextInputModule.TextInput />)).toBeTruthy()
  })

  test("renders with label", () => {
    render(<TextInput label="Username" type={InputType.Text} />)
    expect(screen.getByText("Username")).toBeInTheDocument()
  })

  test("handles password visibility toggle", () => {
    render(<TextInput placeholder="Enter password" type={InputType.Password} />)
    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement
    const toggleButton = screen.getByRole("button")

    expect(input.type).toBe("password")
    fireEvent.click(toggleButton)
    expect(input.type).toBe("text")
    fireEvent.click(toggleButton)
    expect(input.type).toBe("password")
  })

  test("displays error message when invalid", () => {
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

  test("handles disabled state", () => {
    render(<TextInput disabled placeholder="Disabled input" type={InputType.Text} />)
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled()
  })

  test("forwards ref correctly", () => {
    const ref = { current: null }
    render(<TextInput ref={ref} type={InputType.Text} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test("applies custom styles and props", () => {
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

  test("handles input value changes", () => {
    render(<TextInput placeholder="Enter text" type={InputType.Text} />)
    const input = screen.getByPlaceholderText("Enter text")
    fireEvent.change(input, { target: { value: "Test value" } })
    expect(input).toHaveValue("Test value")
  })

  test("handles default text input type", () => {
    render(<TextInput data-testid="default-input" label="Default Input" />)
    expect(screen.getByTestId("default-input")).toHaveAttribute("type", "text")
  })
})
