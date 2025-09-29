"use client"

import type { AdminGameSession } from "@repo/shared"
import { Popup } from "@repo/shared"
import { CalendarSelectPopup } from "@repo/ui/components/Generic"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { formatDate, formatTime, getStatusColor } from "@repo/ui/utils"
import { CalendarIcon, ClockIcon, MapPinIcon, UsersRoundIcon } from "@yamada-ui/lucide"
import { EmptyState, Tag, Text, useUpdateEffect, VStack } from "@yamada-ui/react"
import { memo, useCallback, useMemo, useState } from "react"
import type { ChangeSessionPopupProps } from "./types"

const EMPTY_STATE_ICON_SIZE = "5xl"

/**
 * ChangeSessionPopup component for changing game sessions in admin interface
 *
 * A specialized calendar popup that allows admins to change game sessions
 * by selecting a date and viewing available sessions for that date.
 * Integrates with the CalendarSelectPopup to provide a seamless date
 * selection experience with session information display.
 *
 * @param props ChangeSessionPopup component properties
 * @returns A memoized change session popup component
 *
 * @example
 * ```tsx
 * <ChangeSessionPopup
 *   isOpen={isPopupOpen}
 *   onClose={() => setIsPopupOpen(false)}
 *   availableSessions={sessions}
 *   selectedDate={selectedDate}
 *   currentSession={currentSession}
 *   isLoading={isChangingSession}
 *   onConfirm={(session) => handleSessionConfirm(session)}
 *   onDateSelect={(date) => handleDateSelect(date)}
 * />
 * ```
 */
export const ChangeSessionPopup = memo(
  ({
    isOpen,
    onClose,
    availableSessions = [],
    selectedDate: externalSelectedDate,
    onConfirm,
    onDateSelect,
    currentSession,
    isLoading = false,
    title = "Change Session",
    description = "Select a new date to view available sessions",
    popupId = Popup.CHANGE_SESSION,
    ...calendarPopupProps
  }: ChangeSessionPopupProps) => {
    const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
      externalSelectedDate || null,
    )

    // Sync external selectedDate with internal state
    useUpdateEffect(() => {
      setInternalSelectedDate(externalSelectedDate || null)
    }, [externalSelectedDate])

    const handleDateSelect = useCallback(
      (date: Date | [Date?, Date?] | null) => {
        if (date && !Array.isArray(date)) {
          setInternalSelectedDate(date)
          onDateSelect?.(date)
        }
      },
      [onDateSelect],
    )

    const handleSessionSelect = useCallback(
      (session: AdminGameSession) => {
        onConfirm?.(session)
      },
      [onConfirm],
    )

    const sessionsForSelectedDate = useMemo(() => {
      if (!internalSelectedDate) {
        return []
      }
      return availableSessions.filter((session) => {
        const sessionDate = new Date(session.startTime)
        return (
          sessionDate.toDateString() === internalSelectedDate.toDateString() &&
          session.id !== currentSession?.id
        )
      })
    }, [availableSessions, internalSelectedDate, currentSession])

    const isCurrentSessionDate = useMemo(() => {
      if (!internalSelectedDate || !currentSession) {
        return false
      }
      const currentSessionDate = new Date(currentSession.startTime)
      return currentSessionDate.toDateString() === internalSelectedDate.toDateString()
    }, [internalSelectedDate, currentSession])

    const excludeCurrentSessionDate = useCallback(
      (date: Date) => {
        if (!currentSession) {
          return false
        }
        const currentSessionDate = new Date(currentSession.startTime)
        return date.toDateString() === currentSessionDate.toDateString()
      },
      [currentSession],
    )

    const selectedSessionDisplay = useMemo(() => {
      if (!internalSelectedDate) {
        return (
          <EmptyState
            description="Select a date from the calendar to view session details"
            indicator={<CalendarIcon fontSize={EMPTY_STATE_ICON_SIZE} />}
            title="No Date Selected"
          />
        )
      }

      if (isCurrentSessionDate) {
        return (
          <EmptyState
            description="This is the current session date. Please select a different date to change the session."
            indicator={<CalendarIcon fontSize={EMPTY_STATE_ICON_SIZE} />}
            title="Current Session Date"
          />
        )
      }

      if (sessionsForSelectedDate.length === 0) {
        return (
          <EmptyState
            description="There are no sessions available for the selected date"
            indicator={<CalendarIcon fontSize={EMPTY_STATE_ICON_SIZE} />}
            title="No Sessions Available"
          />
        )
      }

      // there may be multiple sessions for the same date (due to the suggested type),
      // although this is very unlikely
      // we assume that the first session is the one to change to
      const selectedSession = sessionsForSelectedDate[0]
      const colorScheme = getStatusColor(selectedSession.status)

      const sessionDate = new Date(selectedSession.startTime)
      const formattedDate = formatDate(sessionDate)

      return (
        <VStack align="flex-start" gap="md" w="full">
          <Tag colorScheme={colorScheme} px="md" py="xs" rounded="full" size="sm" variant="solid">
            {selectedSession.status}
          </Tag>

          <VStack align="flex-start" gap="sm" w="full">
            <Heading.h4 color="white" fontSize="xl" fontWeight="bold">
              {formattedDate}
            </Heading.h4>

            <VStack align="flex-start" gap="sm" w="full">
              <IconWithText icon={<ClockIcon color="gray.300" fontSize="sm" />}>
                <Text color="white">{`${formatTime(selectedSession.startTime)} - ${formatTime(selectedSession.endTime)}`}</Text>
              </IconWithText>
              <IconWithText icon={<MapPinIcon color="gray.300" fontSize="sm" />}>
                <Text color="white">{selectedSession.location}</Text>
              </IconWithText>
              <IconWithText icon={<UsersRoundIcon color="gray.300" fontSize="sm" />}>
                <Text color="white">{`${selectedSession.attendees}/${selectedSession.capacity} attendees`}</Text>
              </IconWithText>
            </VStack>
          </VStack>
        </VStack>
      )
    }, [internalSelectedDate, sessionsForSelectedDate, isCurrentSessionDate])

    return (
      <CalendarSelectPopup.Root
        {...calendarPopupProps}
        calendarProps={{
          ...calendarPopupProps.calendarProps,
          onChange: undefined, // Remove onChange to avoid type conflicts
          excludeDate: (date: Date) => {
            const existingExcludeDate = calendarPopupProps.calendarProps?.excludeDate
            const isExcludedByCurrent = existingExcludeDate ? existingExcludeDate(date) : false
            const isCurrentSessionDate = excludeCurrentSessionDate(date)
            return isExcludedByCurrent || isCurrentSessionDate
          },
        }}
        closeBehavior="custom"
        description={description}
        gameSessions={availableSessions}
        initialDate={internalSelectedDate}
        isOpen={isOpen}
        onClose={onClose}
        onDateSelect={handleDateSelect}
        popupId={popupId}
        showTrigger={false}
        title={title}
      >
        <CalendarSelectPopup.Content>
          <VStack gap="lg" h="full" w="full">
            {selectedSessionDisplay}
            {internalSelectedDate &&
              sessionsForSelectedDate.length > 0 &&
              !isCurrentSessionDate && (
                <VStack gap="sm" w="full">
                  <Button
                    colorScheme="primary"
                    loading={isLoading}
                    onClick={() => handleSessionSelect(sessionsForSelectedDate[0])}
                    size="md"
                    w="full"
                  >
                    Confirm
                  </Button>
                  <Button
                    colorScheme="primary"
                    onClick={onClose}
                    size="md"
                    variant="outline"
                    w="full"
                  >
                    Cancel
                  </Button>
                </VStack>
              )}
          </VStack>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>
    )
  },
)

ChangeSessionPopup.displayName = "ChangeSessionPopup"
