import { PlayLevel } from "@repo/shared"
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
    role: "admin",
    remaining: "10",
    joined: "2021-01-01",
    university: "University of Auckland",
    level: PlayLevel.beginner,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Casual",
    remaining: "10",
    joined: "2021-01-01",
    university: "Auckland University of Technology",
    level: PlayLevel.advanced,
  },
  {
    id: "3",
    name: "Charlie Smith",
    email: "charlie@example.com",
    role: "member",
    remaining: "10",
    joined: "2021-01-01",
    university: "Massey University",
    level: PlayLevel.intermediate,
  },
  {
    id: "4",
    name: "David Smith",
    email: "david@example.com",
    role: "Casual",
    remaining: "10",
    joined: "2021-01-01",
    university: "University of Auckland",
    level: PlayLevel.beginner,
  },
  {
    id: "5",
    name: "Eve Smith",
    email: "eve@example.com",
    role: "member",
    remaining: "10",
    joined: "2021-01-01",
    university: "Auckland University of Technology",
    level: PlayLevel.advanced,
  },
  {
    id: "6",
    name: "Frank Smith",
    email: "frank@example.com",
    role: "Casual",
    remaining: "10",
    joined: "2021-01-01",
    university: "Massey University",
    level: PlayLevel.intermediate,
  },
  {
    id: "7",
    name: "Grace Smith",
    email: "grace@example.com",
    role: "member",
    remaining: "10",
    joined: "2021-01-01",
    university: "University of Auckland",
    level: PlayLevel.beginner,
  },
  {
    id: "8",
    name: "Hank Smith",
    email: "hank@example.com",
    role: "Casual",
    remaining: "10",
    joined: "2021-01-01",
    university: "Auckland University of Technology",
    level: PlayLevel.advanced,
  },
]

export const Default: Story = {
  args: {
    data: mockData,
  },
}
