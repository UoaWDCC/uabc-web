import { isValidElement } from "react"
import { AdminTable } from "./AdminTable"

describe("<AdminTable />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<AdminTable />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdminTable.displayName).toBe("AdminTable")
  })
})
