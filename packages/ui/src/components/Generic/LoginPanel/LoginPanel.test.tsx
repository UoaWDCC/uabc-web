import "@testing-library/jest-dom"
import type { LoginDetails } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as LoginPanelModule from "./index"
import { LoginPanel } from "./LoginPanel"

describe("<LoginPanel />", () => {
  it("should re-export the LoginPanel component and check if LoginPanel exists", () => {
    expect(LoginPanelModule.LoginPanel).toBeDefined()
    expect(isValidElement(<LoginPanelModule.LoginPanel />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(LoginPanel.displayName).toBe("LoginPanel")
  })

  it("should call onSubmit when a user clicks the submit button with valid data", async () => {
    const handleSubmit = vi.fn((data: LoginDetails) => data)

    const { user } = render(<LoginPanel onSubmit={handleSubmit} />)

    const sampleEmail = "straightzhao@gmail.com"
    const samplePassword = "str@!ghtZh@069"

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, sampleEmail)

    const passwordInput = screen.getByTestId("password")
    await user.type(passwordInput, samplePassword)

    const submitButton = screen.getByText("Sign In")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      email: sampleEmail,
      password: samplePassword,
    })
  })

  it("should not call onSubmit when text input values are invalid", async () => {
    const handleSubmit = vi.fn((data: LoginDetails) => data)

    const { user } = render(<LoginPanel onSubmit={handleSubmit} />)

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, "invalid-email")

    const submitButton = screen.getByText("Sign In")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })

  it("should call onClickGoogle when a user clicks the Google icon button", async () => {
    const handleClickGoogle = vi.fn()

    const { user } = render(<LoginPanel onClickGoogle={handleClickGoogle} />)

    const googleIconButton = screen.getByTestId("google-logo")
    await user.click(googleIconButton)

    expect(handleClickGoogle).toBeCalled()
  })
})
