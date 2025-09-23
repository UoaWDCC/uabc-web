import { zodResolver } from "@hookform/resolvers/zod"
import { SemesterNamePopUpSchema, type SemesterNamePopUpValues } from "@repo/shared"
import { Button, Heading, TextInput } from "@repo/ui/components/Primitive"
import {
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  type FC,
  FormControl,
  memo,
  noop,
  Text,
  VStack,
} from "@yamada-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"

export interface SemesterNamePopUpProps {
  /**
   * Default values to pre-fill the form.
   */
  defaultValues?: SemesterNamePopUpValues

  /**
   * Whether the popup is open or not.
   * @default false
   */
  open: boolean

  /**
   * Submit handler called when user submits the form.
   */
  onConfirm?: SubmitHandler<SemesterNamePopUpValues>

  /**
   * Handler called when the user clicks the cancel button or closes the dialog.
   */
  onCancel?: () => void
}

export const SemesterNamePopUp: FC<SemesterNamePopUpProps> = memo(
  ({ defaultValues, open, onConfirm, onCancel, ...props }) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<SemesterNamePopUpValues>({
      resolver: zodResolver(SemesterNamePopUpSchema),
      defaultValues,
    })

    return (
      <Dialog
        borderRadius="3xl"
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap={{ base: "md", md: "lg" }}
        h={{ base: "auto", md: "458px" }}
        isOpen={open}
        layerStyle="gradientBorder"
        maxW={{ base: "90%", md: "675px" }}
        onClose={onCancel}
        px="lg"
        py="lg"
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
        <VStack
          as="form"
          h="full"
          justifyContent="center"
          onSubmit={handleSubmit(onConfirm ?? noop)}
        >
          <DialogHeader justifyContent="center" w="full">
            <Heading.h2 fontSize="5xl" fontWeight="semibold" textAlign="center">
              Create New Semester
            </Heading.h2>
          </DialogHeader>
          <DialogBody justifyContent="center" px={{ base: "10%", md: "15%" }}>
            <VStack align="center" gap="lg">
              <Heading.h2 fontSize="3xl" fontWeight="medium" textAlign="center">
                Enter{" "}
                <Text as="span" fontWeight="bold">
                  Semester
                </Text>{" "}
                Name
              </Heading.h2>
              <FormControl errorMessage={errors.name?.message} isInvalid={!!errors.name}>
                <TextInput placeholder="Enter Semester Name" {...register("name")} size="lg" />
              </FormControl>
            </VStack>
          </DialogBody>
          <DialogFooter justifyContent="center" w="full">
            <ButtonGroup flexDirection={{ base: "column-reverse", md: "row" }} gap="md">
              <Button colorScheme="secondary" onClick={onCancel} size="lg">
                Cancel
              </Button>
              <Button colorScheme="primary" loading={isSubmitting} size="lg" type="submit">
                Confirm
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </VStack>
      </Dialog>
    )
  },
)

SemesterNamePopUp.displayName = "SemesterNamePopUp"
