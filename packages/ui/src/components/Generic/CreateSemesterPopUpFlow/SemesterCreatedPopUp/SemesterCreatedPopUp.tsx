import { capitalize, formatDate, formatTime } from "@repo/shared/utils"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  type FC,
  SimpleGrid,
  Text,
  VStack,
} from "@yamada-ui/react"

/**
 * Represents the data required for confirming the creation of a semester.
 * This includes details about the semester's name, dates, break period, and booking settings.
 */
export interface SemesterConfirmationData {
  /**
   * The name of the semester.
   */
  name?: string
  /**
   * The start date of the semester, in string format.
   */
  startDate?: string
  /**
   * The end date of the semester, in string format.
   */
  endDate?: string
  /**
   * The start date of the break period, in string format.
   */
  breakStart?: string
  /**
   * The end date of the break period, in string format.
   */
  breakEnd?: string
  /**
   * The day of the week when booking opens.
   */
  bookingOpenDay?: string
  /**
   * The time when booking opens, in string format.
   */
  bookingOpenTime?: string
}
/**
 * Represents the props for the SemesterCreatedPopUp component.
 * This includes flags for dialog state, title, data to display, and callback functions.
 */
export interface SemesterCreatedPopUpProps {
  /**
   * Whether the dialog is open.
   */
  open: boolean
  /**
   * The title of the dialog.
   */
  title: string
  /**
   * The data to display in the dialog.
   */
  data: SemesterConfirmationData
  /**
   * Callback to close the dialog.
   */
  onClose: () => void
  /**
   * Callback to confirm the creation.
   */
  onConfirm: () => void
  /**
   * Optional callback to go back.
   */
  onBack?: () => void
}

/**
 * Renders a single information row consisting of a label and its value.
 *
 * The component displays the label in a muted style and the value in a more
 * prominent style. If the value is undefined, a dash ("—") is rendered to
 * indicate the absence of a value.
 *
 * @param props.label - The label text to display
 * @param props.value - The value associated with the label; may be undefined
 */
const InfoRow: FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <>
    <Text color="whiteAlpha.600" fontWeight="medium">
      {label}
    </Text>
    <Text fontWeight="semibold">{value ?? "—"}</Text>
  </>
)

/**
 * A dialog component for confirming the creation of a semester.
 *
 * This component displays the details of the semester to be created, including
 * name, dates, break period, and booking settings. It provides buttons to
 * confirm, cancel, or go back.
 *
 * @param props The props for SemesterCreatedPopUp
 */
export const SemesterCreatedPopUp: FC<SemesterCreatedPopUpProps> = ({
  open,
  title,
  data,
  onClose,
  onConfirm,
  onBack,
}) => {
  return (
    <Dialog
      borderRadius="3xl"
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
      gap={{ base: "md", md: "lg" }}
      layerStyle="gradientBorder"
      maxW={{ base: "90%", md: "675px" }}
      onClose={onClose}
      open={open}
      p="lg"
    >
      <DialogCloseButton
        bg="black"
        borderRadius="full"
        layerStyle="gradientBorder"
        right="md"
        size="md"
        top="md"
      />
      <DialogHeader justifyContent="center" w="full">
        <Heading.h2 fontSize="4xl" fontWeight="semibold" textAlign="center">
          {title}
        </Heading.h2>
      </DialogHeader>
      <DialogBody justifyContent="center" px={{ base: "10%", md: "15%" }}>
        <VStack gap="lg" w="full">
          <Text color="whiteAlpha.700" textAlign="center">
            Please review the details below before confirming.
          </Text>
          <VStack gap="md" w="full">
            <Heading.h3 fontSize="lg" fontWeight="semibold">
              Semester
            </Heading.h3>
            <SimpleGrid columns={2} gap="sm" w="full">
              <InfoRow label="Name" value={data.name} />
              <InfoRow
                label="Start Date"
                value={data.startDate ? formatDate(new Date(data.startDate)) : undefined}
              />
              <InfoRow
                label="End Date"
                value={data.endDate ? formatDate(new Date(data.endDate)) : undefined}
              />
            </SimpleGrid>
          </VStack>
          <VStack gap="md" w="full">
            <Heading.h3 fontSize="lg" fontWeight="semibold">
              Break Period
            </Heading.h3>
            <SimpleGrid columns={2} gap="sm" w="full">
              <InfoRow
                label="Break Start"
                value={data.breakStart ? formatDate(new Date(data.breakStart)) : undefined}
              />
              <InfoRow
                label="Break End"
                value={data.breakEnd ? formatDate(new Date(data.breakEnd)) : undefined}
              />
            </SimpleGrid>
          </VStack>
          <VStack gap="md" w="full">
            <Heading.h3 fontSize="lg" fontWeight="semibold">
              Booking Settings
            </Heading.h3>
            <SimpleGrid columns={2} gap="sm" w="full">
              <InfoRow
                label="Opens On"
                value={data.bookingOpenDay ? capitalize(data.bookingOpenDay) : undefined}
              />
              <InfoRow
                label="Opens At"
                value={data.bookingOpenTime ? formatTime(data.bookingOpenTime) : undefined}
              />
            </SimpleGrid>
          </VStack>
        </VStack>
      </DialogBody>
      <DialogFooter justifyContent="center" w="full">
        <ButtonGroup flexDirection={{ base: "column-reverse", md: "row" }} gap="md">
          {onBack && (
            <Button colorScheme="secondary" onClick={onBack} size="lg">
              <ArrowLeftIcon />
              Back
            </Button>
          )}
          <Button colorScheme="primary" onClick={onConfirm} size="lg">
            Confirm
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

SemesterCreatedPopUp.displayName = "SemesterCreatedPopUp"
