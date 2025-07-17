import type { Meta, StoryObj } from "@storybook/react"
import type { Column } from "@yamada-ui/table"
import { NuqsAdapter } from "nuqs/adapters/react"
import { ManagementTable } from "./ManagementTable"

const mockData = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    university: "University of Auckland",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    role: "casual",
    university: "Auckland University of Technology",
  },
  {
    id: "3",
    name: "Charlie",
    email: "charlie@example.com",
    role: "member",
    university: "Massey University",
  },
  {
    id: "4",
    name: "David",
    email: "david@example.com",
    role: "casual",
    university: "University of Auckland",
  },
  {
    id: "5",
    name: "Eve",
    email: "eve@example.com",
    role: "member",
    university: "Auckland University of Technology",
  },
  {
    id: "6",
    name: "Frank",
    email: "frank@example.com",
    role: "casual",
    university: "Massey University",
  },
  {
    id: "7",
    name: "Grace",
    email: "grace@example.com",
    role: "member",
    university: "University of Auckland",
  },
  {
    id: "8",
    name: "Hank",
    email: "hank@example.com",
    role: "casual",
    university: "Auckland University of Technology",
  },
]

const mockColumns: Column<(typeof mockData)[number]>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "university",
    header: "University",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
]

const meta: Meta<typeof ManagementTable> = {
  title: "Generic Components / ManagementTable",
  component: ManagementTable,
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

export const Default: Story = {
  render: () => (
    <ManagementTable
      columns={mockColumns}
      columnsConfig={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "university", label: "University" },
      ]}
      data={mockData}
      emptyStateColumnKey="name"
      emptyStateText="No users found."
      rowId="id"
    />
  ),
}

export const WithActionCell: Story = {
  render: () => (
    <ManagementTable
      actions={[
        {
          text: "Edit",
          onClick: (row) => {
            console.log("Edit", row)
          },
        },
        {
          text: "Delete",
          onClick: (row) => {
            console.log("Delete", row)
          },
        },
      ]}
      columns={mockColumns}
      columnsConfig={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "university", label: "University" },
      ]}
      data={mockData}
      emptyStateColumnKey="name"
      emptyStateText="No users found."
      rowId="id"
    />
  ),
}

export const Advanced: Story = {
  render: () => (
    <ManagementTable
      actions={[
        {
          text: "Edit",
          onClick: (row) => {
            console.log("Edit", row)
          },
        },
        {
          text: "Delete",
          onClick: (row) => {
            console.log("Delete", row)
          },
        },
      ]}
      columns={mockColumns}
      columnsConfig={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "university", label: "University" },
      ]}
      data={mockData}
      emptyStateColumnKey="name"
      emptyStateText="No users found."
      filterConfigs={[
        {
          key: ["name", "email", "university"],
          type: "text",
          placeholder: "Filter...",
        },
        {
          key: "role",
          type: "multiselect",
          items: [
            { label: "Admin", value: "admin" },
            { label: "Casual", value: "casual" },
            { label: "Member", value: "member" },
          ],
          label: "All",
          onChange: () => {
            console.log("onChange")
          },
        },
        {
          key: "university",
          type: "multiselect",
          items: [
            { label: "University of Auckland", value: "university-of-auckland" },
            {
              label: "Auckland University of Technology",
              value: "auckland-university-of-technology",
            },
            { label: "Massey University", value: "massey-university" },
          ],
          label: "University",
          w: "md",
        },
      ]}
      rowId="id"
    />
  ),
}
