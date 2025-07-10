import { isValidElement } from "react"
import { SkeletonTable } from "./SkeletonTable"

describe("<SkeletonTable />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<SkeletonTable />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(SkeletonTable.displayName).toBe("SkeletonTable")
  })
})
