import { isValidElement } from "react"
import TermsOfServiceContent from "./page"

describe("<TermsOfServiceContent />", () => {
  it("should be valid react component", () => {
    expect(TermsOfServiceContent).toBeDefined()
    expect(isValidElement(<TermsOfServiceContent />)).toBe(true)
  })
})
