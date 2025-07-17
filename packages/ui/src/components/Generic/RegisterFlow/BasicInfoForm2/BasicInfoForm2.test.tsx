import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import type { BasicInfoForm2Values } from "../schema"
import * as BasicInfoForm2Module from "./index"
import { BasicInfoForm2 } from "./index"

describe("<BasicInfoForm2 />", () => {
  it("should re-export the BasicInfoForm2 component and check if BasicInfoForm2 exists", () => {
    expect(BasicInfoForm2Module.BasicInfoForm2).toBeDefined()
    expect(isValidElement(<BasicInfoForm2Module.BasicInfoForm2 />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(BasicInfoForm2.displayName).toBe("BasicInfoForm2")
  })

  it("should call onSubmit when a user clicks the submit button with valid data", async () => {
    const handleSubmit = vi.fn((data: BasicInfoForm2Values) => data)

    const { user } = render(<BasicInfoForm2 onSubmit={handleSubmit} />)

    const samplePhoneNumber = "021 234 5678"

    const phoneNumberInput = screen.getByTestId("phone-number")
    await user.type(phoneNumberInput, samplePhoneNumber)

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      phoneNumber: samplePhoneNumber,
    })
  })

  it("should not call onSubmit when text input values are invalid", async () => {
    const handleSubmit = vi.fn((data: BasicInfoForm2Values) => data)

    const { user } = render(<BasicInfoForm2 onSubmit={handleSubmit} />)

    const phoneNumberInput = screen.getByTestId("phone-number")
    await user.type(phoneNumberInput, "not-a-phone-number")

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })
})
