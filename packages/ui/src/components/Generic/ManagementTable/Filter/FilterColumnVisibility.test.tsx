import { isValidElement } from "react"
import { FilterColumnVisibility } from "./FilterColumnVisibility"

describe("<FilterColumnVisibility />", () => {
  it("should have correct displayName", () => {
    expect(FilterColumnVisibility.displayName).toBe("FilterColumnVisibility")
  })

  it("should be a valid React element", () => {
    expect(isValidElement(<FilterColumnVisibility columns={[]} />)).toBeTruthy()
  })
})
