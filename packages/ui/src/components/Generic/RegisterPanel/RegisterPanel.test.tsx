import "@testing-library/jest-dom"
import type { LoginRequestBody } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as RegisterPanelModule from "./index"
import { RegisterPanel } from "./RegisterPanel"

describe("<RegisterPanel />", () => {
  it("should re-export the RegisterPanel component and check if RegisterPanel exists", () => {
    expect(RegisterPanelModule.RegisterPanel).toBeDefined()
    expect(isValidElement(<RegisterPanelModule.RegisterPanel />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(RegisterPanel.displayName).toBe("RegisterPanel")
  })

  it("should call onSubmit when a user clicks the submit button with valid data", async () => {
    const handleSubmit = vi.fn((data: LoginRequestBody) => data)

    const { user } = render(<RegisterPanel onSubmit={handleSubmit} />)

    const sampleEmail = "straightzhao@gmail.com"
    const samplePassword = "str@!ghtZh@069"

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, sampleEmail)

    const passwordInput = screen.getByTestId("password")
    await user.type(passwordInput, samplePassword)

    const confirmPasswordInput = screen.getByTestId("confirm-password")
    await user.type(confirmPasswordInput, samplePassword)

    const submitButton = screen.getByText("Register")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      email: sampleEmail,
      password: samplePassword,
      confirmPassword: samplePassword,
    })
  })

  it("should not call onSubmit when text input values are invalid", async () => {
    const handleSubmit = vi.fn((data: LoginRequestBody) => data)

    const { user } = render(<RegisterPanel onSubmit={handleSubmit} />)

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, "invalid-email")

    const submitButton = screen.getByText("Register")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })

  it("should not call onSubmit if email and password are valid but confirmPassword does not match", async () => {
    const handleSubmit = vi.fn((data: LoginRequestBody) => data)

    const { user } = render(<RegisterPanel onSubmit={handleSubmit} />)

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, "straightzhao@gmail.com")

    const passwordInput = screen.getByTestId("password")
    await user.type(passwordInput, "str@!ghtZh@069")

    const confirmPasswordInput = screen.getByTestId("confirm-password")
    await user.type(confirmPasswordInput, "mismatching-password")

    const submitButton = screen.getByText("Register")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })

  it("should call onClickGoogle when a user clicks the Google icon button", async () => {
    const handleClickGoogle = vi.fn()

    const { user } = render(<RegisterPanel onClickGoogle={handleClickGoogle} />)

    const googleIconButton = screen.getByTestId("google-logo")
    await user.click(googleIconButton)

    expect(handleClickGoogle).toBeCalled()
  })
})
