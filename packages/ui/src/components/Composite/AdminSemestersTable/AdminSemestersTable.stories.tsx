import { gameSessionScheduleMock } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import type { ComponentProps } from "react"
import { AdminSemestersTable } from "./AdminSemestersTable"

type AdminSemestersTableArgs = ComponentProps<typeof AdminSemestersTable>

const meta: Meta<AdminSemestersTableArgs> = {
  title: "Composite Components / AdminSemestersTable",
  component: AdminSemestersTable,
  argTypes: {
    onEditRow: { action: "edit-row" },
    onDeleteRow: { action: "delete-row" },
  },
}

export default meta
type Story = StoryObj<AdminSemestersTableArgs>

export const Default: Story = {
  render: (args) => (
    <AdminSemestersTable
      data={[
        gameSessionScheduleMock,
        {
          ...gameSessionScheduleMock,
          name: "ABA",
          day: "wednesday",
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toUTCString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toUTCString(),
        },
        {
          ...gameSessionScheduleMock,
          name: "Auckland Badminton",
          day: "tuesday",
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toUTCString(),
          endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toUTCString(),
        },
      ]}
      onDeleteRow={args.onDeleteRow}
      onEditRow={args.onEditRow}
    />
  ),
}

export const Empty: Story = {
  render: (args) => (
    <AdminSemestersTable data={[]} onDeleteRow={args.onDeleteRow} onEditRow={args.onEditRow} />
  ),
}
