"use client"

import type { AdminGameSession } from "@repo/shared"
import { useAdminSessionsCalendar } from "@repo/ui/hooks"
import type { CalendarProps } from "@yamada-ui/calendar"
import { Calendar } from "@yamada-ui/calendar"
import { Center, dataAttr, Float, Tag, Tooltip, useComponentStyle } from "@yamada-ui/react"
import { memo } from "react"

export interface AdminSessionsCalendarProps {
  /**
   * Currently selected date
   */
  selectedDate: Date
  /**
   * Callback when a date is selected
   */
  onDateSelect: (date: Date) => void
  /**
   * Array of game sessions to display on the calendar
   */
  gameSessions?: AdminGameSession[]
  /**
   * Additional props to pass to the Calendar component
   */
  calendarProps?: CalendarProps
}

/**
 * AdminSessionsCalendar component for displaying a calendar interface
 *
 * Provides a custom calendar view where admins can only select dates that have active sessions.
 * Inactive dates are disabled and cannot be selected. When multiple sessions exist on the same day,
 * the tag displays the total number of attendees across all sessions for that date.
 *
 * @param selectedDate Currently selected date
 * @param onDateSelect Callback when a date is selected
 * @param gameSessions Array of game sessions to display on the calendar
 * @param calendarProps Additional props to pass to the Calendar component
 * @returns A calendar component for date selection
 *
 * @example
 * ```tsx
 * <AdminSessionsCalendar
 *   selectedDate={new Date()}
 *   onDateSelect={(date) => setSelectedDate(date)}
 *   gameSessions={[
 *     {
 *       id: "session-123",
 *       day: "Tuesday",
 *       status: "ongoing",
 *       startTime: "2025-01-21T19:30:00Z",
 *       endTime: "2025-01-21T22:00:00Z",
 *       name: "UoA Rec Centre",
 *       location: "17 Symonds Street",
 *       attendees: 39,
 *       capacity: 40,
 *       casualAttendees: 5,
 *       casualCapacity: 10
 *     },
 *     {
 *       id: "session-124",
 *       day: "Tuesday",
 *       status: "ongoing",
 *       startTime: "2025-01-21T14:00:00Z",
 *       endTime: "2025-01-21T16:30:00Z",
 *       name: "UoA Rec Centre",
 *       location: "17 Symonds Street",
 *       attendees: 25,
 *       capacity: 30,
 *       casualAttendees: 3,
 *       casualCapacity: 5
 *     }
 *   ]}
 * />
 * ```
 */
export const AdminSessionsCalendar = memo(
  ({
    selectedDate,
    onDateSelect,
    gameSessions = [],
    calendarProps = {},
  }: AdminSessionsCalendarProps) => {
    const [styles] = useComponentStyle("IconButton", {
      colorScheme: "secondary",
      size: "xs",
    })

    const { getSessionsForDate, isDateActive, getTotalAttendeesForDate, getTotalCapacityForDate } =
      useAdminSessionsCalendar({
        gameSessions,
      })

    return (
      <Calendar
        borderWidth="1px"
        controlProps={{ w: "$sizes.10 !important", h: "$sizes.10 !important" }}
        dayProps={{
          h: "auto",
          p: "1",
          _selected: {},
          _hover: {},
          _active: {},
          _ripple: {
            display: "none",
          },

          transitionProperty: "none",
          overflow: "visible",
          component: ({ date, selected }) => {
            const sessions = getSessionsForDate(date)
            const active = isDateActive(date)
            const totalAttendees = getTotalAttendeesForDate(date)
            const totalCapacity = getTotalCapacityForDate(date)
            const tooltipLabel = `${totalAttendees} / ${totalCapacity} attendees`

            const colorScheme = totalAttendees >= totalCapacity ? "danger" : "success"

            return (
              <Center
                __css={styles}
                _disabled={{
                  bg: "transparent !important",
                  _before: {
                    display: "none",
                  },
                  cursor: "not-allowed",
                }}
                _selected={{
                  bg: "$colors.primary !important",
                }}
                data-disabled={dataAttr(!active)}
                data-selected={dataAttr(selected && active)}
                minH={{ base: "9", sm: "10" }}
                minW={{ base: "9", sm: "10" }}
                overflow="visible"
              >
                {date.getDate()}
                {sessions.length > 0 && (
                  <Float>
                    <Tooltip label={tooltipLabel}>
                      <Tag
                        aria-label={tooltipLabel}
                        colorScheme={colorScheme}
                        fontSize="xs"
                        lineHeight="1"
                        minH="4"
                        minW="4"
                        p="1"
                        size="sm"
                      >
                        {totalAttendees}
                      </Tag>
                    </Tooltip>
                  </Float>
                )}
              </Center>
            )
          },
        }}
        excludeDate={(date) => !isDateActive(date)}
        labelProps={{ pointerEvents: "none", icon: { display: "none" } }}
        onChange={onDateSelect}
        p="sm"
        rounded="md"
        size={{ base: "md", sm: "lg" }}
        value={selectedDate}
        {...calendarProps}
      />
    )
  },
)

AdminSessionsCalendar.displayName = "AdminSessionsCalendar"
