import { PlayLevel } from "@repo/shared"
import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { AdminSessionsTable } from "./AdminSessionsTable"

const meta: Meta<typeof AdminSessionsTable> = {
  title: "Composite Components / AdminSessionsTable",
  component: AdminSessionsTable,
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
    sessions: "10",
    level: PlayLevel.beginner,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "casual",
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
  {
    id: "4",
    name: "David Smith",
    email: "david@example.com",
    role: "casual",
    sessions: "10",
    level: PlayLevel.beginner,
  },
  {
    id: "5",
    name: "Eve Smith",
    email: "eve@example.com",
    role: "member",
    sessions: "10",
    level: PlayLevel.advanced,
  },
  {
    id: "6",
    name: "Frank Smith",
    email: "frank@example.com",
    role: "casual",
    sessions: "10",
    level: PlayLevel.intermediate,
  },
  {
    id: "7",
    name: "Grace Smith",
    email: "grace@example.com",
    role: "member",
    sessions: "10",
    level: PlayLevel.beginner,
  },
  {
    id: "8",
    name: "Hank Smith",
    email: "hank@example.com",
    role: "casual",
    sessions: "10",
    level: PlayLevel.advanced,
  },
]

export const Default: Story = {
  args: {
    data: mockData,
  },
}
