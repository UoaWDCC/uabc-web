import type { GameSessionSchedule, Semester } from "@repo/shared/payload-types"
import { EllipsisVerticalIcon, PlusIcon } from "@yamada-ui/lucide"
import {
  Accordion,
  AccordionItem,
  AccordionLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  VStack,
} from "@yamada-ui/react"
import { GameSessionScheduleCard } from "../../Generic/GameSessionScheduleCard"
import { Button } from "../../Primitive"
import { AdminSemestersTable } from "../AdminSemestersTable"

/**
 * Props for AdminSemestersAccordion component
 */
export interface AdminSemestersAccordionProps {
  /**
   * The semester object associated with the accordion.
   */
  semester: Semester
  /**
   * The schedules in this semester
   */
  rows?: GameSessionSchedule[]
  /**
   * Whether the accordion is expanded by default.
   */
  defaultExpanded?: boolean
  /**
   * Callback function to add a new game session schedule.
   */
  onAddSchedule?: () => void
  /**
   * Callback function to edit an existing game session schedule.
   */
  onEditSchedule?: (updatedSchedule: GameSessionSchedule) => void
  /**
   * Callback function to delete a game session schedule by its ID.
   */
  onDeleteSchedule?: (sessionId: string) => void
  /**
   * Callback function to edit the semester.
   */
  onEditSemester?: (semesterId: string) => void
  /**
   * Callback function to delete the semester by its ID.
   */
  onDeleteSemester?: (semesterId: string) => void
}

export const AdminSemestersAccordion = ({
  semester,
  rows = [],
  defaultExpanded = false,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onEditSemester,
  onDeleteSemester,
}: AdminSemestersAccordionProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true })

  return (
    <Accordion defaultIndex={defaultExpanded ? [0] : []} multiple>
      <AccordionItem title={semester.name}>
        <AccordionLabel>
          <HStack alignItems="center" justifyContent="space-between" py="sm" w="full">
            <Text fontSize="xl" fontWeight="semibold">
              {semester.name}
            </Text>
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
                  <MenuItem onClick={() => onEditSemester?.(semester.id)}>Edit</MenuItem>
                  <MenuItem onClick={() => onDeleteSemester?.(semester.id)}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </AccordionLabel>
        {isDesktop ? (
          <AdminSemestersTable
            data={rows}
            onDeleteRow={onDeleteSchedule}
            onEditRow={onEditSchedule}
          />
        ) : (
          <VStack gap="md" p="0">
            {rows.map((row) => {
              return <GameSessionScheduleCard gameSessionSchedule={row} key={row.id} />
            })}
          </VStack>
        )}
        <VStack mt="lg">
          <Button
            colorScheme="primary"
            onClick={(e) => {
              e.stopPropagation()
              onAddSchedule?.()
            }}
            rounded="xl"
            startIcon={<PlusIcon />}
            w="full"
          >
            Add New Session
          </Button>
        </VStack>
      </AccordionItem>
    </Accordion>
  )
}
