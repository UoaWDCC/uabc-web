// import { zodResolver } from "@hookform/resolvers/zod"
import type { SemesterDatePopUpValues } from "@repo/shared"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { Calendar } from "@yamada-ui/calendar"
import { ArrowLeft, SquareDashedMousePointer } from "@yamada-ui/lucide"
import {
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
import type { SubmitHandler } from "react-hook-form"

export interface SemesterDatePopUpProps {
  /**
   * Default values to pre-fill the form.
   */
  defaultValues?: SemesterDatePopUpValues

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
   * Submit handler called when user submits the form.
   */
  onNext?: SubmitHandler<SemesterDatePopUpValues>

  /**
   * Handler called when the user clicks the cancel button or closes the dialog.
   */
  onClose?: () => void
}

export const SemesterDatePopUp: FC<SemesterDatePopUpProps> = memo(
  ({ defaultValues, onNext, open, onClose, title, subtitle, ...props }) => {
    // const {
    //   //   register,
    //   //   handleSubmit,
    // } = useForm<SemesterDatePopUpValues>({
    //   resolver: zodResolver(SemesterDatePopUpSchema),
    //   defaultValues,
    // })

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
          <VStack
            gap="lg"
            h="full"
            justifyContent="center"
            placeItems={{ base: "center", md: "start" }}
          >
            <Heading.h1>Create New Semester</Heading.h1>
            <Text fontSize="2xl" fontWeight="normal">
              Semester Name{" "}
            </Text>
            <VStack w="auto">
              <Calendar background="blackAlpha.500" layerStyle="gradientBorder" size="lg" />
            </VStack>
          </VStack>
          <VStack
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            h="full"
            justifyContent="center"
          >
            <Divider bg="grey" h="100%" orientation="vertical" w="2px" />
          </VStack>
          <VStack
            alignItems="center"
            gap="md"
            h="full"
            justifyContent="center"
            placeItems={{ base: "center", md: "center" }}
          >
            <DialogBody alignItems="center" gap="xl" justifyContent="center">
              <Heading.h2 fontSize="2xl" fontWeight="medium">
                {title}
              </Heading.h2>
              <Heading.h3 fontSize="sm" fontWeight="hairline" textAlign="center">
                {subtitle}
              </Heading.h3>
              <SquareDashedMousePointer fontSize="120px" strokeWidth={0.5} />
            </DialogBody>
            <DialogFooter>
              <Button gap="0" onClick={() => {}}>
                <ArrowLeft />
                Back
              </Button>
            </DialogFooter>
          </VStack>
        </SimpleGrid>
      </Dialog>
    )
  },
)

SemesterDatePopUp.displayName = "SemesterDatePopUp"
