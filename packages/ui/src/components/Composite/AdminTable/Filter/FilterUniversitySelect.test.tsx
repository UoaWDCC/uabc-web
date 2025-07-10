import { isValidElement } from "react"
import { FilterUniversitySelect } from "./FilterUniversitySelect"

describe("<FilterUniversitySelect />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<FilterUniversitySelect />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(FilterUniversitySelect.displayName).toBe("FilterUniversitySelect")
  })
})
