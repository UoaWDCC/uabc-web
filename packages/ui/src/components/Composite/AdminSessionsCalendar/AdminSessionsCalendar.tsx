"use client"

import type { AdminGameSession } from "@repo/shared"
import type { CalendarProps } from "@yamada-ui/calendar"
import { Calendar } from "@yamada-ui/calendar"
import { Center, dataAttr, Float, Tag, useComponentStyle } from "@yamada-ui/react"
import { memo, useCallback, useMemo } from "react"

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
 * Inactive dates are disabled and cannot be selected. Tooltips show session information for each date.
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

    const sessionsByDate = useMemo(() => {
      const map = new Map<string, AdminGameSession>()
      gameSessions.forEach((session) => {
        const dateString = new Date(session.startTime).toISOString().split("T")[0]
        map.set(dateString, session)
      })
      return map
    }, [gameSessions])

    const getSessionForDate = useCallback(
      (date: Date) => {
        const dateString = date.toISOString().split("T")[0]
        return sessionsByDate.get(dateString)
      },
      [sessionsByDate],
    )

    const isDateActive = useCallback(
      (date: Date) => {
        return getSessionForDate(date) !== undefined
      },
      [getSessionForDate],
    )

    return (
      <Calendar
        borderWidth="1px"
        controlProps={{
          __css: styles,
          borderWidth: "0",
        }}
        dayProps={{
          h: "auto",
          p: "1.5",
          _selected: {},
          _hover: {},
          _active: {},
          _ripple: {
            display: "none",
          },
          transitionProperty: "none",
          overflow: "visible",
          component: ({ date, selected }) => {
            const session = getSessionForDate(date)
            const active = isDateActive(date)

            return (
              <Center
                __css={styles}
                _selected={{
                  bg: "$colors.primary !important",
                }}
                data-disabled={dataAttr(!active)}
                data-selected={dataAttr(selected && active)}
                h="2rem"
                overflow="visible"
                w="2rem"
              >
                {date.getDate()}
                {session && (
                  <Float>
                    <Tag fontSize="2xs" lineHeight="1" minH="4" minW="4" p="1" size="sm">
                      {session.attendees}
                    </Tag>
                  </Float>
                )}
              </Center>
            )
          },
        }}
        excludeDate={(date) => !isDateActive(date)}
        labelProps={{ pointerEvents: "none", icon: { display: "none" } }}
        nextProps={{ variant: "outline", w: "8", h: "8" }}
        onChange={onDateSelect}
        p="md"
        prevProps={{ variant: "outline", w: "8", h: "8" }}
        rounded="md"
        today
        value={selectedDate}
        {...calendarProps}
      />
    )
  },
)

AdminSessionsCalendar.displayName = "AdminSessionsCalendar"
