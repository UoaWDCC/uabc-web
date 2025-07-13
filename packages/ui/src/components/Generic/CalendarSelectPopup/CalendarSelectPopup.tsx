"use client"

import { Heading, IconButton } from "@repo/ui/components/Primitive"
import { Calendar } from "@yamada-ui/calendar"
import { CalendarIcon } from "@yamada-ui/lucide"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  SimpleGrid,
  Text,
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
 * synchronization, multi-step flows, and custom content areas.
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
      children,
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

    const handleCalendarChange = useCallback(
      (date: Date | [Date?, Date?]) => {
        setDate(date as DateValue<T>)
      },
      [setDate],
    )

    const resolvedCalendarProps = useMemo(
      () => ({
        colorScheme: "primary" as const,
        size: "lg" as const,
        type: "date" as const,
        locale: "nz",
        ...calendarProps,
        value: calendarProps.enableRange
          ? (selectedDate as [Date?, Date?] | undefined)
          : (selectedDate as Date | undefined),
        onChange: handleCalendarChange,
      }),
      [calendarProps, selectedDate, handleCalendarChange],
    )

    const resolvedDialogProps = useMemo(
      () => ({
        size: "6xl",
        minH: "3xl",
        gap: "lg",
        p: "lg",
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
        />
      ),
      [open],
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
          {allowClose && <DialogCloseButton right="lg" top="lg" />}
          <DialogHeader>
            <Heading.h2>{title}</Heading.h2>
          </DialogHeader>

          <DialogBody>
            <Text fontSize="lg">{description}</Text>
            <SimpleGrid columns={2} flex={1} gap="md" h="full" w="full">
              <VStack h="full" w="full">
                <Calendar {...resolvedCalendarProps} />
              </VStack>
              <VStack h="full" w="full">
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
