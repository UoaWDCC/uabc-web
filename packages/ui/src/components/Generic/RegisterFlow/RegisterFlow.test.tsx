import { Gender, PlayLevel, University } from "@repo/shared/types"
import { setupTestEnvironment } from "@repo/ui/test-config/localStorage-test-utils"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as RegisterFlowModule from "./index"
import { RegisterFlow } from "./index"

describe("<RegisterFlow />", () => {
  beforeEach(() => {
    setupTestEnvironment()
  })

  it("should re-export the RegisterFlow component and check if RegisterFlow exists", () => {
    expect(RegisterFlowModule.RegisterFlow).toBeDefined()
    expect(isValidElement(<RegisterFlowModule.RegisterFlow />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(RegisterFlow.displayName).toBe("RegisterFlow")
  })

  it("should progress through the entire register flow and display the Register Success Panel once complete", async () => {
    const { user } = render(<RegisterFlow />)

    // Basic Info Form 1
    expect(screen.getByTestId("go-back")).toBeDisabled()
    await user.type(screen.getByTestId("first-name"), "Brandon")
    await user.type(screen.getByTestId("last-name"), "Chan")
    await user.click(screen.getByText("Continue"))

    // Basic Info Form 2
    await user.type(screen.getByTestId("phone-number"), "021 234 5678")
    await user.click(screen.getByText("Continue"))

    // University Info Form
    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.uoa))
    await user.type(screen.getByTestId("student-id"), "610855188")
    await user.type(screen.getByTestId("student-upi"), "bond007")
    await user.click(screen.getByText("Continue"))

    // Additional Info Form
    await user.click(screen.getByTestId("gender"))
    await user.click(screen.getByText(Gender.female))
    await user.click(screen.getByTestId("skill-level"))
    await user.click(screen.getByText(PlayLevel.advanced))
    await user.type(screen.getByTestId("dietary-requirements"), "BEANS")
    await user.click(screen.getByText("Continue"))

    // Casual Info Form
    await user.click(await screen.findByTestId("agree"))
    await user.click(screen.getByText("Continue"))

    // Register Success Panel
    expect(screen.getByTestId("go-back")).toBeDisabled()
    expect(screen.getByText("Success!")).toBeInTheDocument()
  })

  it("should return to the previous step when the go back button is pressed, and pre-fill the fields", async () => {
    const { user } = render(<RegisterFlow />)

    const sampleFirstName = "Brandon"
    const sampleLastName = "Chan"

    // Basic Info Form 1
    await user.type(screen.getByTestId("first-name"), sampleFirstName)
    await user.type(screen.getByTestId("last-name"), sampleLastName)
    await user.click(screen.getByText("Continue"))

    // Basic Info Form 2
    await user.click(screen.getByTestId("go-back"))

    // Basic Info Form 1
    expect(screen.getByDisplayValue(sampleFirstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(sampleLastName)).toBeInTheDocument()
  })
})
