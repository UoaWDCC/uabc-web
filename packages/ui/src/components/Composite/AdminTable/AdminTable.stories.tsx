import { Gender, MembershipType, PlayLevel, University } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { AdminTable } from "./AdminTable"

const meta: Meta<typeof AdminTable> = {
  title: "Composite Components / AdminTable",
  component: AdminTable,
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

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
  {
    id: "4",
    firstName: "David",
    lastName: "Smith",
    email: "david@example.com",
    role: MembershipType.casual,
    phoneNumber: "019 283 4756",
    playLevel: PlayLevel.beginner,
    gender: Gender.male,
    studentId: "592254566",
    // cspell:disable-next-line
    studentUpi: "dsmi987",
    university: University.uoa,
    remainingSessions: 10,
    updatedAt: "",
    createdAt: "",
  },
  {
    id: "5",
    firstName: "Eve",
    lastName: "Smith",
    email: "eve@example.com",
    role: MembershipType.member,
    phoneNumber: "021 777 8888",
    playLevel: PlayLevel.advanced,
    gender: Gender.female,
    dietaryRequirements: "Vegetarian",
    university: University.aut,
    remainingSessions: 10,
    updatedAt: "",
    createdAt: "",
  },
  {
    id: "6",
    firstName: "Frank",
    lastName: "Smith",
    email: "frank@example.com",
    role: MembershipType.casual,
    phoneNumber: "027 111 2222",
    playLevel: PlayLevel.intermediate,
    gender: Gender.male,
    dietaryRequirements: "Gluten-free",
    university: University.massey,
    remainingSessions: 5,
    updatedAt: "",
    createdAt: "",
  },
  {
    id: "7",
    firstName: "Grace",
    lastName: "Smith",
    email: "grace@example.com",
    role: MembershipType.member,
    phoneNumber: "020 333 5555",
    playLevel: PlayLevel.beginner,
    gender: Gender.female,
    studentId: "888123456",
    // cspell:disable-next-line
    studentUpi: "gsmi321",
    university: University.uoa,
    remainingSessions: 7,
    updatedAt: "",
    createdAt: "",
  },
  {
    id: "8",
    firstName: "Hank",
    lastName: "Smith",
    email: "hank@example.com",
    role: MembershipType.casual,
    phoneNumber: "029 555 6666",
    playLevel: PlayLevel.advanced,
    gender: Gender.male,
    dietaryRequirements: "Halal",
    university: University.aut,
    remainingSessions: 3,
    updatedAt: "",
    createdAt: "",
  },
]

export const Default: Story = {
  args: {
    data: mockData,
  },
}
