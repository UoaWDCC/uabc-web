"use client"

import type { GameSessionSchedule, Semester } from "@repo/shared/payload-types"
import { AdminSemestersAccordionItem } from "@repo/ui/components/Composite"
import { memo } from "react"
import { useGetGameSessionSchedulesBySemester } from "@/services/admin/game-session-schedule/AdminGameSessionScheduleQueries"

interface SemesterScheduleAccordionItemProps {
  /**
   * The semester to display in the accordion item.
   */
  semester: Semester
  /**
   * Whether this accordion item is currently expanded.
   * Controls lazy loading — the schedule query only fires when true.
   */
  enabled: boolean
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

/**
 * An accordion item for a semester that lazily fetches its game session schedules
 * only when the item is expanded. Passes loading and schedule data down to
 * `AdminSemestersAccordionItem`.
 */
export const SemesterScheduleAccordionItem = memo(
  ({
    semester,
    enabled,
    onAddSchedule,
    onEditSchedule,
    onDeleteSchedule,
    onEditSemester,
    onDeleteSemester,
  }: SemesterScheduleAccordionItemProps) => {
    const { data, isLoading } = useGetGameSessionSchedulesBySemester(semester.id, enabled)

    return (
      <AdminSemestersAccordionItem
        isLoading={enabled && isLoading}
        onAddSchedule={onAddSchedule}
        onDeleteSchedule={onDeleteSchedule}
        onDeleteSemester={onDeleteSemester}
        onEditSchedule={onEditSchedule}
        onEditSemester={onEditSemester}
        rows={data?.data ?? []}
        semester={semester}
      />
    )
  },
)
