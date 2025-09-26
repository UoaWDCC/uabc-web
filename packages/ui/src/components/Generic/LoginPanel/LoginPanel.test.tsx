import "@testing-library/jest-dom"
import type { LoginRequestBody, LoginResponse } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as LoginPanelModule from "./index"
import { LoginPanel } from "./LoginPanel"

describe("<LoginPanel />", () => {
  it("should re-export the LoginPanel component and check if LoginPanel exists", () => {
    expect(LoginPanelModule.LoginPanel).toBeDefined()
    expect(isValidElement(<LoginPanelModule.LoginPanel googleHref="/" />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(LoginPanel.displayName).toBe("LoginPanel")
  })

  it("should call onSubmit when a user clicks the submit button with valid data", async () => {
    const handleSubmit = vi.fn((_data: LoginRequestBody) => {
      return Promise.resolve({ data: "token" } as LoginResponse)
    })

    const { user } = render(<LoginPanel googleHref="/" onSubmit={handleSubmit} />)

    const sampleEmail = "straightzhao@gmail.com"
    const samplePassword = "str@!ghtZh@069"

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, sampleEmail)

    const passwordInput = screen.getByTestId("password")
    await user.type(passwordInput, samplePassword)

    const submitButton = screen.getByText("Login")
    await user.click(submitButton)

    expect(handleSubmit).toHaveResolvedWith({ data: "token" })
  })

  it("should not call onSubmit when text input values are invalid", async () => {
    const handleSubmit = vi.fn((_data: LoginRequestBody) => {
      return Promise.resolve({ error: "Error" } as LoginResponse)
    })

    const { user } = render(<LoginPanel googleHref="/" onSubmit={handleSubmit} />)

    const emailInput = screen.getByTestId("email")
    await user.type(emailInput, "invalid-email")

    const submitButton = screen.getByText("Login")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })

  it("should render the Google icon button as a link with the correct href", async () => {
    const googleUrl = "/"
    render(<LoginPanel googleHref={googleUrl} />)

    const googleIconButton = screen.getByLabelText("Google")
    expect(googleIconButton).toHaveAttribute("href", googleUrl)
  })
})
