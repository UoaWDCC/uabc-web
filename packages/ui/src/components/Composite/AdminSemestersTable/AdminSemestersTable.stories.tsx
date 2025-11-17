import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ComponentProps } from "react"
import { AdminSemestersTable } from "./AdminSemestersTable"

type AdminSemestersTableArgs = ComponentProps<typeof AdminSemestersTable> & {
  count: number
}

const meta = {
  title: "Composite Components / AdminSemestersTable",
  component: AdminSemestersTable,
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  argTypes: {
    count: { control: { type: "number", min: 0, max: 20 } },
    onEditRow: { action: "edit-row" },
    onDeleteRow: { action: "delete-row" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Desktop-only table used inside the Admin Semesters accordion. Columns: Session Name, Time, Session Type.",
      },
    },
  },
} satisfies Meta<AdminSemestersTableArgs>

export default meta
type Story = StoryObj<AdminSemestersTableArgs>

const baseRows = [
  {
    id: "1",
    sessionName: "Tues HIWA Rec Centre",
    time: "7:30pm - 10:00pm",
    sessionType: "Ongoing",
  },
  {
    id: "2",
    sessionName: "Wed King's School",
    time: "7:30pm - 10:00pm",
    sessionType: "Ongoing",
  },
  {
    id: "3",
    sessionName: "Fri HIWA Rec Centre",
    time: "7:30pm - 10:00pm",
    sessionType: "Ongoing",
  },
  { id: "4", sessionName: "Sat ABA", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
]

const makeRows = (count = 4) => {
  if (count <= baseRows.length) return baseRows.slice(0, count)
  const extra = Array.from({ length: count - baseRows.length }).map((_, i) => ({
    id: String(5 + i),
    sessionName: `Extra Session ${i + 1}`,
    time: "7:30pm - 10:00pm",
    sessionType: "Ongoing",
  }))
  return [...baseRows, ...extra]
}

export const Default: Story = {
  args: { count: 4 },
  render: (args) => (
    <AdminSemestersTable
      data={makeRows(args.count)}
      onDeleteRow={args.onDeleteRow}
      onEditRow={args.onEditRow}
    />
  ),
}

export const Empty: Story = {
  args: { count: 0 },
  render: (args) => (
    <AdminSemestersTable
      data={makeRows(args.count)}
      onDeleteRow={args.onDeleteRow}
      onEditRow={args.onEditRow}
    />
  ),
}
