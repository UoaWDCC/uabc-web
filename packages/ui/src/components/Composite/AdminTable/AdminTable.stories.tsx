import { MembershipType, PlayLevel, University } from "@repo/shared"
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

const mockData = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: MembershipType.ADMIN,
    remaining: "10",
    joined: "2021-01-01",
    university: University.UOA,
    level: PlayLevel.BEGINNER,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: MembershipType.CASUAL,
    remaining: "10",
    joined: "2021-01-01",
    university: University.AUT,
    level: PlayLevel.ADVANCED,
  },
  {
    id: "3",
    name: "Charlie Smith",
    email: "charlie@example.com",
    role: MembershipType.MEMBER,
    remaining: "10",
    joined: "2021-01-01",
    university: University.MASSEY,
    level: PlayLevel.INTERMEDIATE,
  },
  {
    id: "4",
    name: "David Smith",
    email: "david@example.com",
    role: MembershipType.CASUAL,
    remaining: "10",
    joined: "2021-01-01",
    university: University.UOA,
    level: PlayLevel.BEGINNER,
  },
  {
    id: "5",
    name: "Eve Smith",
    email: "eve@example.com",
    role: MembershipType.MEMBER,
    remaining: "10",
    joined: "2021-01-01",
    university: University.AUT,
    level: PlayLevel.ADVANCED,
  },
  {
    id: "6",
    name: "Frank Smith",
    email: "frank@example.com",
    role: MembershipType.CASUAL,
    remaining: "10",
    joined: "2021-01-01",
    university: University.MASSEY,
    level: PlayLevel.INTERMEDIATE,
  },
  {
    id: "7",
    name: "Grace Smith",
    email: "grace@example.com",
    role: MembershipType.MEMBER,
    remaining: "10",
    joined: "2021-01-01",
    university: University.UOA,
    level: PlayLevel.BEGINNER,
  },
  {
    id: "8",
    name: "Hank Smith",
    email: "hank@example.com",
    role: MembershipType.CASUAL,
    remaining: "10",
    joined: "2021-01-01",
    university: University.AUT,
    level: PlayLevel.ADVANCED,
  },
]

export const Default: Story = {
  args: {
    data: mockData,
  },
}
