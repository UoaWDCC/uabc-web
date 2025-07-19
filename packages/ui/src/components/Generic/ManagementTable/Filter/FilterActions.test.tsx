import { isValidElement } from "react"
import { FilterActions } from "./FilterActions"

describe("<FilterActions />", () => {
  it("should have correct displayName", () => {
    expect(FilterActions.displayName).toBe("FilterActions")
  })

  it("should be a valid React element", () => {
    expect(isValidElement(<FilterActions />)).toBeTruthy()
  })
})
