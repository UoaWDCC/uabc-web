import { fireEvent, render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as TextInputModule from "./index"
import { TextInput } from "./TextInput"
import { InputType } from "./types"

describe("<TextInput />", () => {
  it("should re-export the TextInput component and check if TextInput exists", () => {
    expect(TextInputModule.TextInput).toBeDefined()

    expect(isValidElement(<TextInputModule.TextInput />)).toBeTruthy()
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
    render(<TextInput data-testid="default-input" />)
    expect(screen.getByTestId("default-input")).toHaveAttribute("type", "text")
  })

  it("renders endIcon when provided", () => {
    const endIcon = <span data-testid="end-icon">★</span>
    render(
      <TextInput data-testid="input-with-end-icon" endElement={endIcon} type={InputType.Text} />,
    )

    expect(screen.getByTestId("end-icon")).toBeInTheDocument()
    expect(screen.getByText("★")).toBeInTheDocument()
  })

  it("prioritizes endIcon over password toggle when both could be rendered", () => {
    const endIcon = <span data-testid="end-icon">★</span>
    render(
      <TextInput
        data-testid="password-with-end-icon"
        endElement={endIcon}
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
})
