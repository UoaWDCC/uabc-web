import { Button, Heading, TextInput } from "@repo/ui/components/Primitive"
import {
  Center,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  ErrorMessage,
  FormControl,
  Stack,
  // useDisclosure,
} from "@yamada-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"

/**
 * Props for {@link InputPopUp} component
 */
interface FormData {
  name: string
}

export interface InputPopUpProps extends DialogProps {
  /**
   * The title to display in the dialog header
   */
  title: string
  /**
   * The open state of the dialog
   */
  open: boolean
  /**
   * The function to call when the dialog is closed
   */
  onClose: () => void
  /**
   * The description text to display in the dialog body
   */
  description: string
  /**
   * The function to call when the form is submitted
   */
  onConfirm: (value: string) => void
}

/**
 * Dialog component for collecting user input with a title and description
 *
 * Renders a modal dialog with a title heading, description text, and an input field,
 * designed to collect user input in a clean, accessible interface.
 *
 * @param props InputPopUp component properties
 * @returns A modal dialog with title, description, and input field
 *
 * @example
<InputPopUp
        description="Enter Semester Name:"
        onClose={onClose}
        onConfirm={(val) => console.log("Confirmed:", val)}
        open={open}
        title="Create New Semester"
      />
 */
export const InputPopUp: React.FC<InputPopUpProps> = ({
  open,
  onClose,
  title,
  description,
  onConfirm,
}) => {
  // const { open, onOpen, onClose } = useDisclosure()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = (data) => {
    onConfirm(data.name)
    reset()
    onClose()
  }
  // const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      {/* <Button onClick={onOpen}>{buttonText}</Button> */}

      <Dialog
        alignItems="center"
        as="form"
        bg={["secondary.50", "secondary.900"]}
        // backdropBlur="15px"
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap={{ base: "6", md: "13" }}
        justifyContent="center"
        layerStyle="gradientBorder"
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        open={open}
        p={{ base: "6", md: "13" }}
        rounded="2xl"
        size="3xl"
      >
        <DialogOverlay />
        <DialogCloseButton bg="black" layerStyle="gradientBorder" rounded="full" />
        <DialogHeader justifyContent="center" w="full">
          <Heading.h2
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight={{ base: "medium", md: "medium" }}
            textAlign="center"
          >
            {title}
          </Heading.h2>
        </DialogHeader>
        <DialogBody gap={{ base: "6", md: "13" }} w="full">
          <Heading.h3 fontWeight="light" size={{ sm: "lg", md: "2xl" }} textAlign="center" w="full">
            {description}
          </Heading.h3>

          <FormControl invalid={!!errors.name} w="full">
            <Center w="full">
              <TextInput
                id="name"
                mx="auto"
                placeholder={description.split(":")[0]}
                size="lg"
                w={{ base: "full", sm: "sm" }}
                {...register("name", { required: "This field is required." })}
              />
              <ErrorMessage>{errors.name?.message}</ErrorMessage>
            </Center>
          </FormControl>
        </DialogBody>
        <DialogFooter gap="6.5" w="full">
          <Stack direction={{ base: "column", md: "row" }} gap={{ base: "4", md: "6.5" }} w="full">
            <Button colorScheme="secondary" onClick={onClose} size="md" w="full">
              Cancel
            </Button>
            <Button colorScheme="primary" isLoading={isSubmitting} size="md" type="submit" w="full">
              Confirm
            </Button>
          </Stack>
        </DialogFooter>
        {/* </form> */}
      </Dialog>
    </>
  )
}

InputPopUp.displayName = "InputPopUp"
