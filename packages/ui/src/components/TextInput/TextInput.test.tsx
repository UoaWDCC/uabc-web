import { fireEvent, render } from "@testing-library/react"
import { InputType, TextInput } from "./TextInput"
import * as TextInputModule from "./index"

describe("<TextInput />", () => {
  it("should re-export the TextInput component", () => {
    expect(TextInputModule.TextInput).toBeDefined() // Check if TextInput exists

    expect(typeof TextInputModule.TextInput).toBe("object")
  })

  test("renders with label", () => {
    const { getByText } = render(<TextInput label="Username" type={InputType.Text} />)
    expect(getByText("Username")).toBeInTheDocument()
  })

  test("handles password visibility toggle", () => {
    const { getByRole, getByPlaceholderText } = render(
      <TextInput type={InputType.Password} placeholder="Enter password" />,
    )
    const input = getByPlaceholderText("Enter password") as HTMLInputElement
    const toggleButton = getByRole("button")

    expect(input.type).toBe("password")
    fireEvent.click(toggleButton)
    expect(input.type).toBe("text")
    fireEvent.click(toggleButton)
    expect(input.type).toBe("password")
  })

  test("displays error message when invalid", () => {
    const { getByText } = render(
      <TextInput
        type={InputType.Text}
        label="Email"
        isError={true}
        errorMessage="Invalid email format"
      />,
    )
    expect(getByText("Invalid email format")).toBeInTheDocument()
  })

  test("handles disabled state", () => {
    const { getByPlaceholderText } = render(
      <TextInput type={InputType.Text} disabled placeholder="Disabled input" />,
    )
    const input = getByPlaceholderText("Disabled input")
    expect(input).toBeDisabled()
  })

  test("forwards ref correctly", () => {
    const ref = { current: null }
    render(<TextInput type={InputType.Text} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test("applies custom styles and props", () => {
    const { getByTestId } = render(
      <TextInput
        type={InputType.Text}
        data-testid="custom-input"
        width="300px"
        placeholder="Custom input"
      />,
    )
    const input = getByTestId("custom-input")
    expect(input).toHaveStyle({ width: "300px" })
  })

  test("handles input value changes", () => {
    const { getByPlaceholderText } = render(
      <TextInput type={InputType.Text} placeholder="Enter text" />,
    )
    const input = getByPlaceholderText("Enter text")
    fireEvent.change(input, { target: { value: "Test value" } })
    expect(input).toHaveValue("Test value")
  })
})
