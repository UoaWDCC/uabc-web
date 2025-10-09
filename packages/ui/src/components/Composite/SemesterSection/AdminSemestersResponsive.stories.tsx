import type { Meta, StoryObj } from "@storybook/react"
import {
  Accordion,
  AccordionItem,
  AccordionLabel,
  AccordionPanel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  useBreakpointValue,
} from "@yamada-ui/react"
import { AdminSemestersTable } from "../AdminSemestersTable/AdminSemestersTable"
import type { SemesterSessionRow } from "../AdminSemestersTable/Columns"
import { GameSessionCard } from "../GameSessionCard/GameSessionCard"
import { Button } from "../../Primitive"
import { EllipsisVerticalIcon, PlusIcon } from "@yamada-ui/lucide"

type StoryArgs = {
  title: string
  rows: number
  forceMode: "auto" | "desktop" | "mobile"
  expanded: boolean
}

const meta: Meta<StoryArgs & {
  onAddSession: () => void
  onEditSemester: () => void
  onDeleteSemester: () => void
  onEditRow: () => void
  onDeleteRow: () => void
}> = {
  title: "Composite Components / Admin Semesters Responsive",
  argTypes: {
    title: { control: "text" },
    rows: { control: { type: "number", min: 0, max: 20 } },
    forceMode: { control: { type: "radio" }, options: ["auto", "desktop", "mobile"] },
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
type Story = StoryObj<typeof meta>

const baseRows: SemesterSessionRow[] = [
  { id: "1", sessionName: "Tues HIWA Rec Centre", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
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

const ResponsivePanel = ({
  mode,
  data,
  onEditRow,
  onDeleteRow,
}: {
  mode: "auto" | "desktop" | "mobile"
  data: SemesterSessionRow[]
  onEditRow?: () => void
  onDeleteRow?: () => void
}) => {
  const isDesktop = useBreakpointValue({ base: false, md: true })
  const showTable = mode === "auto" ? isDesktop : mode === "desktop"
  return showTable ? (
    <AdminSemestersTable data={data} onEditRow={onEditRow as any} onDeleteRow={onDeleteRow as any} />
  ) : (
    <VStack gap="md">
      {data.map((r) => (
        <GameSessionCard
          key={r.id}
          session={{ name: r.sessionName, startTime: r.time.split(" - ")[0], endTime: r.time.split(" - ")[1], type: r.sessionType }}
        />
      ))}
    </VStack>
  )
}

export const Default: StoryObj<
  StoryArgs & {
  onAddSession: () => void
  onEditSemester: () => void
  onDeleteSemester: () => void
  onEditRow: () => void
  onDeleteRow: () => void
}
> = {
  args: { title: "2025 Sem 2", rows: 4, forceMode: "auto", expanded: true },
  render: (args) => (
    <Accordion multiple defaultIndex={args.expanded ? [0] : []} w={{ base: "full", md: "full" }}>
      <AccordionItem rounded="xl" px="md" py="sm">
        <AccordionLabel>
          <HStack w="full" justifyContent="space-between" alignItems="center" py="sm">
            <span style={{ fontWeight: 600, fontSize: "1.25rem" }}>{args.title}</span>
            <HStack gap="sm">
              <Button
                colorScheme="primary"
                rounded="xl"
                leftIcon={<PlusIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  args.onAddSession?.()
                }}
              >
                Add New Session
              </Button>
              <Menu lazy>
                <MenuButton
                  aria-label="Semester actions"
                  as={Button}
                  size="xs"
                  variant="ghost"
                  leftIcon={<EllipsisVerticalIcon />}
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList onClick={(e) => e.stopPropagation()}>
                  <MenuItem onClick={args.onEditSemester}>Edit</MenuItem>
                  <MenuItem onClick={args.onDeleteSemester}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </AccordionLabel>
        <AccordionPanel>
          <ResponsivePanel
            mode={args.forceMode}
            data={makeRows(args.rows)}
            onEditRow={args.onEditRow}
            onDeleteRow={args.onDeleteRow}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}

export const Mobile: StoryObj<StoryArgs> = {
  args: { ...Default.args, forceMode: "mobile" },
}

export const Desktop: StoryObj<StoryArgs> = {
  args: { ...Default.args, forceMode: "desktop" },
}

export const Empty: StoryObj<StoryArgs> = {
  args: { ...Default.args, rows: 0 },
}
