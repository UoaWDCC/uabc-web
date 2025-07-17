import type { BasicInfoForm1Values } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as BasicInfoForm1Module from "./index"
import { BasicInfoForm1 } from "./index"

describe("<BasicInfoForm1 />", () => {
  it("should re-export the BasicInfoForm1 component and check if BasicInfoForm1 exists", () => {
    expect(BasicInfoForm1Module.BasicInfoForm1).toBeDefined()
    expect(isValidElement(<BasicInfoForm1Module.BasicInfoForm1 />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(BasicInfoForm1.displayName).toBe("BasicInfoForm1")
  })

  it("should call onSubmit when a user clicks the submit button with valid data", async () => {
    const handleSubmit = vi.fn((data: BasicInfoForm1Values) => data)

    const { user } = render(<BasicInfoForm1 onSubmit={handleSubmit} />)

    const sampleFirstName = "Brandon"
    const sampleLastName = "Chan"

    const firstNameInput = screen.getByTestId("first-name")
    await user.type(firstNameInput, sampleFirstName)

    const lastNameInput = screen.getByTestId("last-name")
    await user.type(lastNameInput, sampleLastName)

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      firstName: sampleFirstName,
      lastName: sampleLastName,
    })
  })

  it("should not call onSubmit when text input values are invalid", async () => {
    const handleSubmit = vi.fn((data: BasicInfoForm1Values) => data)

    const { user } = render(<BasicInfoForm1 onSubmit={handleSubmit} />)

    const firstNameInput = screen.getByTestId("first-name")
    await user.type(firstNameInput, "Brandon")

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })
})
