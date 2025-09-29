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
   * Handler called when the user clicks the next button.
   */
  onNext?: (data: { startDate: string; endDate: string }) => void

  /**
   * Handler called when the user clicks the cancel button or closes the dialog.
   */
  onClose?: () => void
}

export const SemesterDatePopUp: FC<SemesterDatePopUpProps> = memo(
  ({ onNext, open, onClose, title, subtitle, ...props }) => {
    const [selectedDate, setSelectedDate] = useState<Date | [Date?, Date?] | null>(null)

    // Reset selected date when component opens
    useEffect(() => {
      if (open) {
        setSelectedDate(null)
      }
    }, [open])

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
              Semester Name{" "}
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
                <Button colorScheme="secondary" gap="0" onClick={onClose}>
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
