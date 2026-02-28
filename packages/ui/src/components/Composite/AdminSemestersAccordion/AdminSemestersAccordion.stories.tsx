import { gameSessionScheduleMock, semesterMock } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import type { ComponentProps } from "react"
import { AdminSemestersAccordion } from "./AdminSemestersAccordion"

type AdminSemestersAccordionArgs = ComponentProps<typeof AdminSemestersAccordion>

const meta: Meta<AdminSemestersAccordionArgs> = {
  title: "Composite Components / AdminSemestersAccordion",
  component: AdminSemestersAccordion,
  argTypes: {
    onAddSchedule: { action: "add-schedule" },
    onEditSchedule: { action: "edit-schedule" },
    onDeleteSchedule: { action: "delete-schedule" },
    onEditSemester: { action: "edit-semester" },
    onDeleteSemester: { action: "delete-semester" },
  },
}

export default meta
type Story = StoryObj<AdminSemestersAccordionArgs>

export const Default: Story = {
  render: (args) => (
    <AdminSemestersAccordion
      onAddSchedule={args.onAddSchedule}
      onDeleteSchedule={args.onDeleteSchedule}
      onDeleteSemester={args.onDeleteSemester}
      onEditSchedule={args.onEditSchedule}
      onEditSemester={args.onEditSemester}
      rows={[gameSessionScheduleMock, gameSessionScheduleMock, gameSessionScheduleMock]}
      semester={semesterMock}
    />
  ),
}

export const Expanded: Story = {
  render: (args) => (
    <AdminSemestersAccordion
      defaultExpanded
      onAddSchedule={args.onAddSchedule}
      onDeleteSchedule={args.onDeleteSchedule}
      onDeleteSemester={args.onDeleteSemester}
      onEditSchedule={args.onEditSchedule}
      onEditSemester={args.onEditSemester}
      rows={[gameSessionScheduleMock, gameSessionScheduleMock, gameSessionScheduleMock]}
      semester={semesterMock}
    />
  ),
}

export const MultipleSemesters: Story = {
  render: (args) => (
    <>
      <AdminSemestersAccordion
        defaultExpanded
        onAddSchedule={args.onAddSchedule}
        onDeleteSchedule={args.onDeleteSchedule}
        onDeleteSemester={args.onDeleteSemester}
        onEditSchedule={args.onEditSchedule}
        onEditSemester={args.onEditSemester}
        rows={[gameSessionScheduleMock, gameSessionScheduleMock, gameSessionScheduleMock]}
        semester={semesterMock}
      />
      <AdminSemestersAccordion
        onAddSchedule={args.onAddSchedule}
        onDeleteSchedule={args.onDeleteSchedule}
        onDeleteSemester={args.onDeleteSemester}
        onEditSchedule={args.onEditSchedule}
        onEditSemester={args.onEditSemester}
        rows={[gameSessionScheduleMock, gameSessionScheduleMock]}
        semester={{ ...semesterMock, id: "semester-2", name: "Semester 2 2025" }}
      />
    </>
  ),
}
