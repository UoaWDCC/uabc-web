"use client"

import { Button, Heading } from "@repo/ui/components/Primitive"
import { Calendar } from "@yamada-ui/calendar"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  type FC,
  memo,
  Separator,
  SimpleGrid,
  Text,
  VStack,
} from "@yamada-ui/react"
import { useEffect, useState } from "react"
import { DateRangeDisplay } from "../../DateRangeDisplay"

export interface SemesterDatePopUpProps {
  /**
   * Whether the popup is open or not.
   * @default false
   */
  open: boolean

  /**
   * Title to display in the pop-up header.
   */
  title: string

  /**
   * Optional subtitle or additional information in the pop-up.
   */
  subtitle?: string

  /**
   * Name of the semester to display in the pop-up.
   */
  semesterName: string

  /**
   * Default values to pre-fill the date selection.
   */
  defaultValues?: { startDate: string; endDate: string }

  /**
   * Handler called when the user clicks the next button.
   */
  onNext?: (data: { startDate: string; endDate: string }) => void

  /**
   * Handler called when the user clicks the back button.
   */
  onBack?: () => void

  /**
   * Handler called when the user clicks the cancel button or closes the dialog.
   */
  onClose?: () => void
}

/**
 * A pop-up dialog component for selecting a semester date range.
 *
 * Displays a calendar for users to pick a start and end date for a semester,
 * along with contextual information such as the semester name and a customizable title.
 *
 * The component supports navigation (back/next), cancellation, and pre-filling of date values.
 *
 * @component
 * @param props - The {@link SemesterDatePopUpProps} properties for the SemesterDatePopUp component.
 * @param [props.open] - Whether the pop-up dialog is open.
 * @param [props.title] - The main title displayed in the pop-up.
 * @param [props.subtitle] - Optional subtitle or additional information.
 * @param [props.semesterName] - The name of the semester to display.
 * @param [props.defaultValues] - Optional default date range to pre-fill the calendar.
 * @param [props.onNext] - Handler called when the user clicks the next button, receiving the selected date range.
 * @param [props.onBack] - Handler called when the user clicks the back button.
 * @param [props.onClose] - Handler called when the user cancels or closes the dialog.
 *
 * @returns The rendered SemesterDatePopUp dialog.
 */
export const SemesterDatePopUp: FC<SemesterDatePopUpProps> = memo(
  ({ onBack, onNext, open, onClose, title, semesterName, subtitle, defaultValues, ...props }) => {
    const [selectedDate, setSelectedDate] = useState<Date | [Date?, Date?] | null>(null)

    // Reset selected date when component opens, but restore from defaultValues if available
    useEffect(() => {
      if (open) {
        if (defaultValues) {
          const startDate = new Date(defaultValues.startDate)
          const endDate = new Date(defaultValues.endDate)
          setSelectedDate([startDate, endDate])
        } else {
          setSelectedDate(null)
        }
      }
    }, [open, defaultValues])

    const handleCalendarChange = (date: Date | [Date?, Date?]) => {
      setSelectedDate(date)
    }

    const handleNext = () => {
      if (selectedDate && Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1]) {
        onNext?.({
          startDate: selectedDate[0].toISOString(),
          endDate: selectedDate[1].toISOString(),
        })
      }
    }

    const [startDate, endDate] = Array.isArray(selectedDate)
      ? [selectedDate[0], selectedDate[1]]
      : [undefined, undefined]

    return (
      <Dialog
        borderRadius="3xl"
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap={{ base: "md", md: "lg" }}
        layerStyle="gradientBorder"
        minH="3xl"
        onClose={onClose}
        open={open}
        p="xl"
        size="6xl"
        {...props}
      >
        <DialogCloseButton
          bg="black"
          borderRadius="full"
          layerStyle="gradientBorder"
          right="md"
          size="md"
          top="md"
        />
        <SimpleGrid
          gap={{ base: "md", md: "lg" }}
          h="full"
          templateColumns={{ base: "1fr", md: "6fr 0.2fr 4fr" }}
          w="full"
        >
          <VStack gap="lg" h="full" placeItems={{ base: "center", md: "start" }}>
            <Heading.h1>Create New Semester</Heading.h1>
            <Text fontSize="2xl" fontWeight="normal">
              {semesterName}
            </Text>
            <VStack w="auto">
              <Calendar
                background="blackAlpha.500"
                enableRange
                layerStyle="gradientBorder"
                onChange={handleCalendarChange}
                size="lg"
                value={selectedDate ?? undefined}
              />
            </VStack>
          </VStack>
          <VStack
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            h="full"
            justifyContent="center"
          >
            <Separator bg="grey" h="xl" orientation="vertical" w="2px" />
          </VStack>
          <VStack
            alignItems="center"
            gap="md"
            h="full"
            justifyContent="center"
            placeItems={{ base: "center", md: "center" }}
          >
            <DialogBody alignItems="center" gap="xl" justifyContent="center">
              <Heading.h2
                fontSize="2xl"
                fontWeight="medium"
                textAlign="center"
                whiteSpace="pre-line"
              >
                <Text>{title}</Text>
              </Heading.h2>
              <Text color="whiteAlpha.600" fontSize="sm" fontWeight="light" textAlign="center">
                {subtitle}
              </Text>
              <DateRangeDisplay endDate={endDate} startDate={startDate} />
            </DialogBody>
            <DialogFooter>
              <ButtonGroup flexDirection="column" gap="md">
                {Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1] && (
                  <Button colorScheme="primary" gap="0" onClick={handleNext}>
                    Next
                    <ArrowRightIcon />
                  </Button>
                )}
                <Button colorScheme="secondary" gap="0" onClick={onBack}>
                  <ArrowLeftIcon />
                  Back
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </VStack>
        </SimpleGrid>
      </Dialog>
    )
  },
)

SemesterDatePopUp.displayName = "SemesterDatePopUp"
