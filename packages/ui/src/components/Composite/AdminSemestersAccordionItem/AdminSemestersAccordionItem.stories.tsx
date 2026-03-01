import { gameSessionScheduleMock, semesterMock } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import { Accordion } from "@yamada-ui/react"
import type { ComponentProps } from "react"
import { AdminSemestersAccordionItem } from "./AdminSemestersAccordionItem"

type AdminSemestersAccordionItemArgs = ComponentProps<typeof AdminSemestersAccordionItem>

const meta: Meta<AdminSemestersAccordionItemArgs> = {
  title: "Composite Components / AdminSemestersAccordionItem",
  component: AdminSemestersAccordionItem,
  argTypes: {
    onAddSchedule: { action: "add-schedule" },
    onEditSchedule: { action: "edit-schedule" },
    onDeleteSchedule: { action: "delete-schedule" },
    onEditSemester: { action: "edit-semester" },
    onDeleteSemester: { action: "delete-semester" },
  },
}

export default meta
type Story = StoryObj<AdminSemestersAccordionItemArgs>

export const Default: Story = {
  render: (args) => (
    <Accordion>
      <AdminSemestersAccordionItem
        onAddSchedule={args.onAddSchedule}
        onDeleteSchedule={args.onDeleteSchedule}
        onDeleteSemester={args.onDeleteSemester}
        onEditSchedule={args.onEditSchedule}
        onEditSemester={args.onEditSemester}
        rows={[gameSessionScheduleMock, gameSessionScheduleMock, gameSessionScheduleMock]}
        semester={semesterMock}
      />
    </Accordion>
  ),
}

export const Expanded: Story = {
  render: (args) => (
    <Accordion defaultIndex={[0]}>
      <AdminSemestersAccordionItem
        onAddSchedule={args.onAddSchedule}
        onDeleteSchedule={args.onDeleteSchedule}
        onDeleteSemester={args.onDeleteSemester}
        onEditSchedule={args.onEditSchedule}
        onEditSemester={args.onEditSemester}
        rows={[gameSessionScheduleMock, gameSessionScheduleMock, gameSessionScheduleMock]}
        semester={semesterMock}
      />
    </Accordion>
  ),
}

export const MultipleSemesters: Story = {
  render: (args) => (
    <Accordion defaultIndex={[0]} multiple>
      <AdminSemestersAccordionItem
        onAddSchedule={args.onAddSchedule}
        onDeleteSchedule={args.onDeleteSchedule}
        onDeleteSemester={args.onDeleteSemester}
        onEditSchedule={args.onEditSchedule}
        onEditSemester={args.onEditSemester}
        rows={[gameSessionScheduleMock, gameSessionScheduleMock, gameSessionScheduleMock]}
        semester={semesterMock}
      />
      <AdminSemestersAccordionItem
        onAddSchedule={args.onAddSchedule}
        onDeleteSchedule={args.onDeleteSchedule}
        onDeleteSemester={args.onDeleteSemester}
        onEditSchedule={args.onEditSchedule}
        onEditSemester={args.onEditSemester}
        rows={[gameSessionScheduleMock, gameSessionScheduleMock]}
        semester={{ ...semesterMock, id: "semester-2", name: "Semester 2 2025" }}
      />
    </Accordion>
  ),
}
