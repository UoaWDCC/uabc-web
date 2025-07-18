import { isValidElement } from "react"
import { AdminTable } from "./AdminTable"

const mockData = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: "member",
    remaining: "10",
    university: "University of Auckland",
    joined: "2021-01-01",
  },
]

describe("<AdminTable />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<AdminTable data={mockData} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdminTable.displayName).toBe("AdminTable")
  })
})
