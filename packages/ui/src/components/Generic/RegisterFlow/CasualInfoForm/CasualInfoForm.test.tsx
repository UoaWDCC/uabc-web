import type { CasualInfoFormValues } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as CasualInfoFormModule from "./index"
import { CasualInfoForm } from "./index"

describe("<CasualInfoForm />", () => {
  it("should re-export the CasualInfoForm component and check if CasualInfoForm exists", () => {
    expect(CasualInfoFormModule.CasualInfoForm).toBeDefined()
    expect(isValidElement(<CasualInfoFormModule.CasualInfoForm />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(CasualInfoForm.displayName).toBe("CasualInfoForm")
  })

  it("should call onSubmit when a user clicks the submit button after checking the box", async () => {
    const handleSubmit = vi.fn((data: CasualInfoFormValues) => data)

    const { user } = render(<CasualInfoForm onSubmit={handleSubmit} />)

    await user.click(await screen.findByTestId("agree"))

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toBeCalled()
  })
})
