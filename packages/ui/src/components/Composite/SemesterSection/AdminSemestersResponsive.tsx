"use client"

import { EllipsisVerticalIcon, PlusIcon } from "@yamada-ui/lucide"
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
  useBreakpointValue,
  VStack,
} from "@yamada-ui/react"
import type { ComponentProps } from "react"
import { memo } from "react"
import { Button } from "../../Primitive"
import { AdminSemestersTable } from "../AdminSemestersTable/AdminSemestersTable"
import type { SemesterSessionRow } from "../AdminSemestersTable/Columns"
import { GameSessionScheduleCard } from "../GameSessionScheduleCard/GameSessionScheduleCard"

export type AdminSemestersResponsiveProps = {
  id?: string
  title: string
  rows: SemesterSessionRow[]
  defaultExpanded?: boolean
  onAddSession?: (semesterId?: string) => void
  onEditSemester?: (semesterId?: string) => void
  onDeleteSemester?: (semesterId?: string) => void
  onEditRow?: (row: SemesterSessionRow) => void
  onDeleteRow?: (row: SemesterSessionRow) => void
  /**
   * Pass-through props for Accordion container if you need to control from parent
   */
  accordionProps?: Partial<ComponentProps<typeof Accordion>>
}

/**
 * Responsive admin Semester section used in the admin area.
 *
 * Behaviors
 * - Desktop: renders a table of sessions via {@link AdminSemestersTable}.
 * - Mobile: renders stacked session cards via {@link GameSessionCard}.
 * - The "Add New Session" button lives inside the accordion panel footer.
 *
 * Props
 * - `title`: accordion header text (e.g., semester name).
 * - `rows`: normalized session rows (`SemesterSessionRow[]`).
 * - `forceMode`: override responsiveness ("auto" | "desktop" | "mobile").
 * - Event handlers: `onAddSession`, `onEditSemester`, `onDeleteSemester`,
 *   `onEditRow`, `onDeleteRow`.
 *
 * Example
 * <AdminSemestersResponsive
 *   id="2025-sem-2"
 *   title="2025 Sem 2"
 *   rows={[
 *     { id: "1", sessionName: "Tue HIWA Rec Centre", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
 *   ]}
 *   onAddSession={(id) => console.log("add", id)}
 *   onEditSemester={(id) => console.log("edit semester", id)}
 *   onDeleteSemester={(id) => console.log("delete semester", id)}
 *   onEditRow={(row) => console.log("edit row", row)}
 *   onDeleteRow={(row) => console.log("delete row", row)}
 * />
 */
export const AdminSemestersResponsive = memo(
  ({
    id,
    title,
    rows,
    defaultExpanded = true,
    onAddSession,
    onEditSemester,
    onDeleteSemester,
    onEditRow,
    onDeleteRow,
    accordionProps,
  }: AdminSemestersResponsiveProps) => {
    const isDesktop = useBreakpointValue({ base: false, md: true })
    const showTable = isDesktop

    return (
      <Accordion
        defaultIndex={defaultExpanded ? [0] : []}
        multiple
        w={{ base: "full", md: "full" }}
        {...accordionProps}
      >
        <AccordionItem px="md" py="sm" rounded="xl">
          <AccordionLabel>
            <HStack alignItems="center" justifyContent="space-between" py="sm" w="full">
              <span style={{ fontWeight: 600, fontSize: "1.25rem" }}>{title}</span>
              <HStack gap="sm">
                <Menu lazy>
                  <MenuButton
                    aria-label="Semester actions"
                    as={Button}
                    leftIcon={<EllipsisVerticalIcon />}
                    onClick={(e) => e.stopPropagation()}
                    size="xs"
                    variant="ghost"
                  />
                  <MenuList onClick={(e) => e.stopPropagation()}>
                    <MenuItem onClick={() => onEditSemester?.(id)}>Edit</MenuItem>
                    <MenuItem onClick={() => onDeleteSemester?.(id)}>Delete</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </HStack>
          </AccordionLabel>

          <AccordionPanel>
            {showTable ? (
              <AdminSemestersTable data={rows} onDeleteRow={onDeleteRow} onEditRow={onEditRow} />
            ) : (
              <VStack gap="md">
                {rows.map((r) => {
                  const [start, end] = r.time.split(" - ")
                  return (
                    <GameSessionScheduleCard
                      gameSessionSchedule={{
                        id: r.id,
                        name: r.sessionName,
                        location: "",
                        semester: "",
                        day: "monday" as any,
                        startTime: start ?? "",
                        endTime: end ?? "",
                        capacity: 0,
                        casualCapacity: 0,
                        updatedAt: "",
                        createdAt: "",
                      }}
                      key={r.id}
                    />
                  )
                })}
              </VStack>
            )}

            {/* Add button must live INSIDE the panel at the bottom */}
            <VStack mt="lg">
              <Button
                colorScheme="primary"
                leftIcon={<PlusIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  onAddSession?.(id)
                }}
                rounded="xl"
                w="full"
              >
                Add New Session
              </Button>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  },
)

AdminSemestersResponsive.displayName = "AdminSemestersResponsive"
