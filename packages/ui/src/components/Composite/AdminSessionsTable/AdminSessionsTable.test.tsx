import { PlayLevel } from "@repo/shared"
import { isValidElement } from "react"
import { AdminSessionsTable } from "./AdminSessionsTable"

const mockData = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: "member",
    sessions: "10",
    level: PlayLevel.beginner,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "member",
    sessions: "10",
    level: PlayLevel.advanced,
  },
  {
    id: "3",
    name: "Charlie Smith",
    email: "charlie@example.com",
    role: "member",
    sessions: "10",
    level: PlayLevel.intermediate,
  },
]

describe("<AdminSessionsTable />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<AdminSessionsTable data={mockData} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdminSessionsTable.displayName).toBe("AdminSessionsTable")
  })
})
