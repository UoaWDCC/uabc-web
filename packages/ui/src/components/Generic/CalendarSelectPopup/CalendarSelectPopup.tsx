"use client"

import { Heading, IconButton } from "@repo/ui/components/Primitive"
import { useAdminSessionsCalendar } from "@repo/ui/hooks"
import { Calendar } from "@yamada-ui/calendar"
import { CalendarIcon } from "@yamada-ui/lucide"
import {
  Center,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  dataAttr,
  Float,
  SimpleGrid,
  Tag,
  Text,
  Tooltip,
  useComponentStyle,
  VStack,
} from "@yamada-ui/react"
import { memo, useCallback, useMemo } from "react"
import { CalendarSelectPopupContext } from "./CalendarSelectPopupContext"
import type { CalendarSelectPopupProps, DateValue, ExtendedCalendarProps } from "./types"
import { useCalendarSelectPopup } from "./useCalendarSelectPopup"

/**
 * CalendarSelectPopup component for date selection with popup dialog interface
 *
 * A comprehensive calendar component that combines a calendar picker with popup dialog
 * functionality. Supports both single date and date range selection, URL state
 * synchronization, multi-step flows, custom content areas, and session-aware calendar
 * functionality for displaying game sessions.
 *
 * @param props CalendarSelectPopup component properties
 * @returns A memoized calendar popup component
 *
 * @example
 * ```tsx
 * // Basic single date selection
 * <CalendarSelectPopup
 *   popupId="date-picker"
 *   title="Select Date"
 *   onDateSelect={(date) => console.log("Selected:", date)}
 *   showTrigger
 * />
 *
 * // Date range selection
 * <CalendarSelectPopup
 *   popupId="date-range"
 *   title="Select Date Range"
 *   initialDate={[undefined, undefined]}
 *   calendarProps={{ enableRange: true }}
 *   onDateSelect={(dates) => console.log("Range:", dates)}
 *   showTrigger
 * />
 *
 * // Session-aware calendar with game sessions
 * <CalendarSelectPopup
 *   popupId="session-calendar"
 *   title="Select Session Date"
 *   gameSessions={sessions}
 *   showSessionIndicators
 *   disableInactiveDates
 *   onDateSelect={(date) => console.log("Selected:", date)}
 *   showTrigger
 * />
 *
 * // Multi-step flow with custom content
 * <CalendarSelectPopup
 *   popupId="booking-step-1"
 *   title="Step 1: Select Date"
 *   currentStep={1}
 *   totalSteps={3}
 *   onStepChange={setStep}
 *   closeBehavior="back"
 * >
 *   <CalendarSelectPopup.Content>
 *     <CalendarSelectPopup.Header title="Choose your date" />
 *     <CalendarSelectPopup.Body>
 *       <CalendarSelectPopup.BackButton />
 *       <CalendarSelectPopup.NextButton />
 *     </CalendarSelectPopup.Body>
 *   </CalendarSelectPopup.Content>
 * </CalendarSelectPopup>
 * ```
 *
 * @remarks
 * The component automatically handles URL state synchronization, allowing for
 * deep linking and browser navigation support. It integrates with the
 * CalendarSelectPopupContext to provide step navigation and date state to child components.
 * When gameSessions are provided, the calendar becomes session-aware, showing session
 * indicators and disabling dates without sessions.
 */
export const CalendarSelectPopup = memo(
  <T extends boolean = false>(props: CalendarSelectPopupProps<T>) => {
    const {
      popupId,
      openValue = "open",
      dateParamKey,
      showTrigger = false,
      isOpen: externalIsOpen,
      currentStep,
      totalSteps,
      allowClose = true,
      closeBehavior = "close",
      onStepChange,
      initialDate,
      description = "Select a date to book your session",
      onDateSelect,
      onClose,
      onOpen,
      calendarProps = {} as ExtendedCalendarProps<T>,
      dialogProps = {},
      title = "Select Date",
      dialogFooter,
      trigger,
      triggerProps,
      children,
      gameSessions = [],
      showSessionIndicators = gameSessions.length > 0,
      disableInactiveDates = gameSessions.length > 0,
    } = props

    const {
      isOpen: internalIsOpen,
      selectedDate,
      open,
      close,
      setDate,
    } = useCalendarSelectPopup<T>({
      popupId,
      openValue,
      dateParamKey,
      initialDate,
      enableRange: calendarProps.enableRange,
      onDateSelect,
      onClose,
      onOpen,
    })

    const { getSessionsForDate, isDateActive, getTotalAttendeesForDate, getTotalCapacityForDate } =
      useAdminSessionsCalendar({
        gameSessions,
      })

    const [styles] = useComponentStyle("IconButton", {
      colorScheme: "secondary",
      size: "xs",
    })

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

    const handleClose = useCallback(() => {
      if (!allowClose) return

      if (externalIsOpen !== undefined) {
        if (closeBehavior === "close") {
          onStepChange?.(null)
        } else if (closeBehavior === "back" && currentStep && currentStep > 1) {
          onStepChange?.(currentStep - 1)
        } else if (closeBehavior === "custom") {
          onClose?.()
        } else {
          onStepChange?.(null)
        }
      } else {
        close()
      }
    }, [allowClose, externalIsOpen, closeBehavior, currentStep, onStepChange, onClose, close])

    const handleOnConfirm = useCallback(
      (date: Date | [Date?, Date?]) => {
        setDate(date as DateValue<T>)
      },
      [setDate],
    )

    const resolvedCalendarProps = useMemo(
      () => ({
        colorScheme: "primary" as const,
        size: "lg" as const,
        locale: "nz" as const,
        ...calendarProps,
        value:
          selectedDate === null
            ? undefined
            : calendarProps.enableRange
              ? (selectedDate as [Date?, Date?] | undefined)
              : (selectedDate as Date | undefined),
        onChange: handleOnConfirm,
        ...(disableInactiveDates && {
          excludeDate: (date: Date) => !isDateActive(date),
        }),
        ...(showSessionIndicators && {
          dayProps: {
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
            component: ({ date, selected }: { date: Date; selected: boolean }) => {
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
          },
        }),
      }),
      [
        calendarProps,
        selectedDate,
        handleOnConfirm,
        disableInactiveDates,
        isDateActive,
        showSessionIndicators,
        getSessionsForDate,
        getTotalAttendeesForDate,
        getTotalCapacityForDate,
        styles,
      ],
    )

    const resolvedDialogProps = useMemo(
      () => ({
        size: "6xl" as const,
        minH: "3xl" as const,
        gap: "lg" as const,
        p: "lg" as const,
        withCloseButton: allowClose,
        ...dialogProps,
        open: isOpen,
        onClose: handleClose,
      }),
      [dialogProps, isOpen, handleClose, allowClose],
    )

    const defaultTrigger = useMemo(
      () => (
        <IconButton
          aria-label="Open calendar"
          colorScheme="primary"
          icon={<CalendarIcon />}
          onClick={open}
          variant="outline"
          {...triggerProps}
        />
      ),
      [open, triggerProps],
    )

    const stepNavigationContext = useMemo(
      () => ({
        currentStep,
        totalSteps,
        onStepChange,
        allowClose,
        closeBehavior,
      }),
      [currentStep, totalSteps, onStepChange, allowClose, closeBehavior],
    )

    return (
      <>
        {!externalIsOpen && showTrigger && (trigger || defaultTrigger)}

        <Dialog {...resolvedDialogProps}>
          {allowClose && (
            <DialogCloseButton
              aria-label="Close"
              bg={["white", "black"]}
              layerStyle="gradientBorder"
              right="lg"
              rounded="full"
              top="lg"
              variant="solid"
            />
          )}
          <DialogHeader placeSelf={{ base: "center", md: "start" }}>
            <Heading.h2>{title}</Heading.h2>
          </DialogHeader>

          <DialogBody alignItems={{ base: "center", md: "start" }} mt={{ base: "0", md: "md" }}>
            <Text fontSize="lg">{description}</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} flex={1} gap="md" h="full" w="full">
              <VStack h="full" placeItems={{ base: "center", md: "start" }} w="full">
                <Calendar {...resolvedCalendarProps} />
              </VStack>
              <VStack h="full" placeItems={{ base: "center", md: "start" }} w="full">
                <CalendarSelectPopupContext.Provider
                  value={{
                    selectedDate: selectedDate as Date | [Date?, Date?] | null,
                    setDate: setDate as (date: Date | [Date?, Date?] | null) => void,
                    stepNavigation: stepNavigationContext,
                  }}
                >
                  {children}
                </CalendarSelectPopupContext.Provider>
              </VStack>
            </SimpleGrid>
          </DialogBody>
          {dialogFooter && <DialogFooter>{dialogFooter}</DialogFooter>}
        </Dialog>
      </>
    )
  },
)

CalendarSelectPopup.displayName = "CalendarSelectPopup"
