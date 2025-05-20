import { fireEvent, render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { InputType, TextInput } from "./TextInput"
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
})
