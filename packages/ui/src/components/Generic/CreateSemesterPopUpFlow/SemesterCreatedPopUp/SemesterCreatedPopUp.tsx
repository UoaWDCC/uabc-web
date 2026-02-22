import { capitalize } from "@repo/shared/utils"
import { Button, Heading } from "@repo/ui/components/Primitive"
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

export interface SemesterConfirmationData {
  name?: string
  startDate?: string
  endDate?: string
  breakStart?: string
  breakEnd?: string
  bookingOpenDay?: string
  bookingOpenTime?: string
}

export interface SemesterCreatedPopUpProps {
  open: boolean
  title: string
  data: SemesterConfirmationData
  onClose: () => void
  onConfirm: () => void
  onBack?: () => void
}

const formatDate = (iso?: string) => {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-NZ", { dateStyle: "long", timeZone: "UTC" })
}

const formatTime = (iso?: string) => {
  if (!iso) return "—"
  const d = new Date(iso)
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`
}

const InfoRow: FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <>
    <Text color="whiteAlpha.600" fontWeight="medium">
      {label}
    </Text>
    <Text fontWeight="semibold">{value ?? "—"}</Text>
  </>
)

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
              <InfoRow label="Start Date" value={formatDate(data.startDate)} />
              <InfoRow label="End Date" value={formatDate(data.endDate)} />
            </SimpleGrid>
          </VStack>
          <VStack gap="md" w="full">
            <Heading.h3 fontSize="lg" fontWeight="semibold">
              Break Period
            </Heading.h3>
            <SimpleGrid columns={2} gap="sm" w="full">
              <InfoRow label="Break Start" value={formatDate(data.breakStart)} />
              <InfoRow label="Break End" value={formatDate(data.breakEnd)} />
            </SimpleGrid>
          </VStack>
          <VStack gap="md" w="full">
            <Heading.h3 fontSize="lg" fontWeight="semibold">
              Booking Settings
            </Heading.h3>
            <SimpleGrid columns={2} gap="sm" w="full">
              <InfoRow label="Opens On" value={capitalize(data.bookingOpenDay || "")} />
              <InfoRow label="Opens At" value={formatTime(data.bookingOpenTime)} />
            </SimpleGrid>
          </VStack>
        </VStack>
      </DialogBody>
      <DialogFooter justifyContent="center" w="full">
        <ButtonGroup flexDirection={{ base: "column-reverse", md: "row" }} gap="md">
          {onBack && (
            <Button colorScheme="secondary" onClick={onBack} size="lg">
              Back
            </Button>
          )}
          <Button colorScheme="secondary" onClick={onClose} size="lg">
            Cancel
          </Button>
          <Button colorScheme="primary" onClick={onConfirm} size="lg">
            Confirm
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

SemesterCreatedPopUp.displayName = "SemesterCreatedPopUp"
