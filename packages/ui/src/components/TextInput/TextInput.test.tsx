import { fireEvent, render } from "@/test-utils"
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
      <TextInput placeholder="Enter password" type={InputType.Password} />,
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
        errorMessage="Invalid email format"
        isError={true}
        label="Email"
        type={InputType.Text}
      />,
    )
    expect(getByText("Invalid email format")).toBeInTheDocument()
  })

  test("handles disabled state", () => {
    const { getByPlaceholderText } = render(
      <TextInput disabled placeholder="Disabled input" type={InputType.Text} />,
    )
    const input = getByPlaceholderText("Disabled input")
    expect(input).toBeDisabled()
  })

  test("forwards ref correctly", () => {
    const ref = { current: null }
    render(<TextInput ref={ref} type={InputType.Text} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test("applies custom styles and props", () => {
    const { getByTestId } = render(
      <TextInput
        data-testid="custom-input"
        placeholder="Custom input"
        type={InputType.Text}
        width="300px"
      />,
    )
    const input = getByTestId("custom-input")
    expect(input).toHaveStyle({ width: "300px" })
  })

  test("handles input value changes", () => {
    const { getByPlaceholderText } = render(
      <TextInput placeholder="Enter text" type={InputType.Text} />,
    )
    const input = getByPlaceholderText("Enter text")
    fireEvent.change(input, { target: { value: "Test value" } })
    expect(input).toHaveValue("Test value")
  })

  test("handles default text input type", () => {
    const { getByTestId } = render(<TextInput data-testid="default-input" label="Default Input" />)
    const input = getByTestId("default-input") as HTMLInputElement
    expect(input.type).toBe("text")
  })
})
