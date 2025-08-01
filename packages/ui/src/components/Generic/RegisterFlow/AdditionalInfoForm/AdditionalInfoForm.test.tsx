import type { AdditionalInfoFormValues } from "@repo/shared"
import { Gender, PlayLevel } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as AdditionalInfoFormModule from "./index"
import { AdditionalInfoForm } from "./index"

describe("<AdditionalInfoForm />", () => {
  it("should re-export the AdditionalInfoForm component and check if AdditionalInfoForm exists", () => {
    expect(AdditionalInfoFormModule.AdditionalInfoForm).toBeDefined()
    expect(isValidElement(<AdditionalInfoFormModule.AdditionalInfoForm />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdditionalInfoForm.displayName).toBe("AdditionalInfoForm")
  })

  it("should call onSubmit when a user clicks the submit button with valid data", async () => {
    const handleSubmit = vi.fn((data: AdditionalInfoFormValues) => data)

    const { user } = render(<AdditionalInfoForm onSubmit={handleSubmit} />)

    const sampleDietaryRequirements = "BEANS"

    await user.click(screen.getByTestId("gender"))
    await user.click(screen.getByText(Gender.female))
    await user.click(screen.getByTestId("skill-level"))
    await user.click(screen.getByText(PlayLevel.advanced))
    await user.type(screen.getByTestId("dietary-requirements"), sampleDietaryRequirements)

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      gender: Gender.female,
      skillLevel: PlayLevel.advanced,
      dietaryRequirements: sampleDietaryRequirements,
    })
  })
})
