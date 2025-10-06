import type { CasualInfoFormValues } from "@repo/shared/types"
import { mockCasualMemberInformation } from "@repo/ui/test-config/mocks/CasualInfoForm.mock"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as CasualInfoFormModule from "./index"
import { CasualInfoForm } from "./index"

describe("<CasualInfoForm />", () => {
  it("should re-export the CasualInfoForm component and check if CasualInfoForm exists", () => {
    expect(CasualInfoFormModule.CasualInfoForm).toBeDefined()
    expect(
      isValidElement(
        <CasualInfoFormModule.CasualInfoForm
          casualMemberInformation={mockCasualMemberInformation}
        />,
      ),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(CasualInfoForm.displayName).toBe("CasualInfoForm")
  })

  it("should call onSubmit when a user clicks the submit button after checking the box", async () => {
    const handleSubmit = vi.fn((data: CasualInfoFormValues) => data)

    const { user } = render(
      <CasualInfoForm
        casualMemberInformation={mockCasualMemberInformation}
        onSubmit={handleSubmit}
      />,
    )

    await user.click(await screen.findByTestId("agree"))

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toBeCalled()
  })

  it("should correctly display the casual member information", () => {
    render(<CasualInfoForm casualMemberInformation={mockCasualMemberInformation} />)

    expect(screen.getByText("Casual members can only attend 1 session a week.")).toBeInTheDocument()
    expect(
      screen.getByText(
        "It is $10 per session and is to be paid before attending to secure your spot. We will send you an email for this, please do not pay unless we reach out to you.",
      ),
    ).toBeInTheDocument()
    expect(screen.getByText("We aim to prioritize members over casuals!")).toBeInTheDocument()
    expect(
      screen.getByText("The number of casuals allowed per session may vary dependent on capacity"),
    ).toBeInTheDocument()
  })
})
