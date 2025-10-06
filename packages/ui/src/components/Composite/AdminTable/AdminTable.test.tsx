import { Gender, MembershipType, PlayLevel, University } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { isValidElement } from "react"
import { AdminTable } from "./AdminTable"

const mockData: User[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    role: MembershipType.admin,
    phoneNumber: "012 122 1222",
    playLevel: PlayLevel.beginner,
    gender: Gender.female,
    dietaryRequirements: "Nuts",
    studentId: "123456789",
    // cspell:disable-next-line
    studentUpi: "asmi123",
    university: University.uoa,
    updatedAt: "",
    createdAt: "",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    role: MembershipType.casual,
    phoneNumber: "022 333 4444",
    playLevel: PlayLevel.advanced,
    gender: Gender.male,
    university: University.aut,
    remainingSessions: 2,
    updatedAt: "",
    createdAt: "",
  },
  {
    id: "3",
    firstName: "Charlie",
    lastName: "Smith",
    email: "charlie@example.com",
    role: MembershipType.member,
    phoneNumber: "0123456789",
    playLevel: PlayLevel.intermediate,
    gender: Gender.nonBinary,
    dietaryRequirements: "No 0s and 1s in my food",
    university: University.massey,
    remainingSessions: 1,
    updatedAt: "",
    createdAt: "",
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
