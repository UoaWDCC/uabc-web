"use client"

import { Button, Heading } from "@repo/ui/components/Primitive"
import { Calendar } from "@yamada-ui/calendar"
import { ArrowLeft, ArrowRight, SquareDashedMousePointer } from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  Divider,
  type FC,
  memo,
  SimpleGrid,
  Text,
  VStack,
} from "@yamada-ui/react"
import { useEffect, useState } from "react"

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
 * @param {SemesterDatePopUpProps} props - The properties for the SemesterDatePopUp component.
 * @param {boolean} props.open - Whether the pop-up dialog is open.
 * @param {string} props.title - The main title displayed in the pop-up.
 * @param {string} [props.subtitle] - Optional subtitle or additional information.
 * @param {string} props.semesterName - The name of the semester to display.
 * @param {{ startDate: string; endDate: string }} [props.defaultValues] - Optional default date range to pre-fill the calendar.
 * @param {(data: { startDate: string; endDate: string }) => void} [props.onNext] - Handler called when the user clicks the next button, receiving the selected date range.
 * @param {() => void} [props.onBack] - Handler called when the user clicks the back button.
 * @param {() => void} [props.onClose] - Handler called when the user cancels or closes the dialog.
 *
 * @returns {JSX.Element} The rendered SemesterDatePopUp dialog.
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

    const formatSelectedDate = () => {
      if (!selectedDate) return subtitle || "Select a date range"

      let dateText = ""
      if (Array.isArray(selectedDate)) {
        const [start, end] = selectedDate
        if (start && end) {
          dateText = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
        } else if (start) {
          dateText = start.toLocaleDateString()
        } else if (end) {
          dateText = end.toLocaleDateString()
        }
      } else {
        dateText = selectedDate.toLocaleDateString()
      }

      return (
        <>
          You have selected:
          <br />
          <br />
          <Text as="span" fontWeight="bold">
            {dateText}
          </Text>
        </>
      )
    }

    return (
      <Dialog
        borderRadius="3xl"
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap={{ base: "md", md: "lg" }}
        isOpen={open}
        layerStyle="gradientBorder"
        minH="3xl"
        onClose={onClose}
        px="xl"
        py="xl"
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
            <Divider bg="grey" h="xl" orientation="vertical" w="2px" />
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
                {title}
              </Heading.h2>
              <Heading.h3
                fontSize="sm"
                fontWeight="hairline"
                textAlign="center"
                whiteSpace="pre-line"
              >
                {formatSelectedDate()}
              </Heading.h3>
              <SquareDashedMousePointer fontSize="120px" strokeWidth={0.5} />
            </DialogBody>
            <DialogFooter>
              <ButtonGroup flexDirection="column" gap="md">
                {selectedDate &&
                  Array.isArray(selectedDate) &&
                  selectedDate[0] &&
                  selectedDate[1] && (
                    <Button colorScheme="primary" gap="0" onClick={handleNext}>
                      Next
                      <ArrowRight />
                    </Button>
                  )}
                <Button colorScheme="secondary" gap="0" onClick={onBack}>
                  <ArrowLeft />
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
