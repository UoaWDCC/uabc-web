import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import type { SemesterSessionRow } from "../AdminSemestersTable/Columns"
import { AdminSemestersResponsive } from "./AdminSemestersResponsive"

type StoryArgs = {
  title: string
  rows: number
  expanded: boolean
}

const meta: Meta<
  StoryArgs & {
    onAddSession: () => void
    onEditSemester: () => void
    onDeleteSemester: () => void
    onEditRow: () => void
    onDeleteRow: () => void
  }
> = {
  title: "Composite Components / Admin Semesters Responsive",
  argTypes: {
    title: { control: "text" },
    rows: { control: { type: "number", min: 0, max: 20 } },
    expanded: { control: "boolean" },
    onAddSession: { action: "add-new-session" },
    onEditSemester: { action: "edit-semester" },
    onDeleteSemester: { action: "delete-semester" },
    onEditRow: { action: "edit-row" },
    onDeleteRow: { action: "delete-row" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Responsive semester section: table on desktop, cards on mobile. Use controls to switch device mode, row count, and expanded state.",
      },
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

const baseRows: SemesterSessionRow[] = [
  {
    id: "1",
    sessionName: "Tues HIWA Rec Centre",
    time: "7:30pm - 10:00pm",
    sessionType: "Ongoing",
  },
  { id: "2", sessionName: "Wed King's School", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
  { id: "3", sessionName: "Fri HIWA Rec Centre", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
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

// Story-only data helpers

export const Default: StoryObj<
  StoryArgs & {
    onAddSession: () => void
    onEditSemester: () => void
    onDeleteSemester: () => void
    onEditRow: () => void
    onDeleteRow: () => void
  }
> = {
  args: { title: "2025 Sem 2", rows: 4, expanded: true },
  render: (args) => (
    <AdminSemestersResponsive
      defaultExpanded={args.expanded}
      id={useId()}
      onAddSession={args.onAddSession}
      onDeleteRow={() => args.onDeleteRow?.()}
      onDeleteSemester={args.onDeleteSemester}
      onEditRow={() => args.onEditRow?.()}
      onEditSemester={args.onEditSemester}
      rows={makeRows(args.rows)}
      title={args.title}
    />
  ),
}
