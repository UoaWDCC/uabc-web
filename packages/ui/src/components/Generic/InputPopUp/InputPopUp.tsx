import { Button, Heading, TextInput } from "@repo/ui/components/Primitive"
import {
  Center,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  Stack,
  useDisclosure,
} from "@yamada-ui/react"
import { useState } from "react"
/**
 * Props for {@link InputPopUp} component
 */
export interface InputPopUpProps {
  /**
   * The button text to display in the button
   */
  buttonText: string
  /**
   * The title to display in the dialog header
   */
  title: string
  /**
   * The description text to display in the dialog body
   */
  description: string
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
 * <InputPopUp
 *   buttonText="Create New Semester"
 *   title="Create New Semester"
 *   description="Enter Semester Name:"
 * />
 */
export const InputPopUp = ({ buttonText, title, description }: InputPopUpProps) => {
  const { open, onOpen, onClose } = useDisclosure()
  const [inputValue, setInputValue] = useState("")
  const handleConfirm = () => {
    console.log("Input value:", inputValue)
    onClose()
  }
  return (
    <>
      <Button onClick={onOpen}>{buttonText}</Button>

      <Dialog
        alignItems="center"
        // backdropBlur="15px"
        bg={["secondary.50", "secondary.900"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap={{ base: "6", md: "13" }}
        justifyContent="center"
        layerStyle="gradientBorder"
        onClose={onClose}
        open={open}
        p={{ base: "6", md: "13" }}
        rounded="2xl"
        size="3xl"
      >
        <DialogCloseButton bg="black" layerStyle="gradientBorder" rounded="full" size="sm" />
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
          <Center w="full">
            <TextInput
              mx="auto"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={description.split(":")[0]}
              size="lg"
              w={{ base: "full", sm: "sm" }}
            />
          </Center>
        </DialogBody>

        <DialogFooter gap="6.5" w="full">
          <Stack direction={{ base: "column", md: "row" }} gap={{ base: "4", md: "6.5" }} w="full">
            <Button colorScheme="secondary" onClick={onClose} size="md" w="full">
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={handleConfirm} size="md" type="submit" w="full">
              Confirm
            </Button>
          </Stack>
        </DialogFooter>
      </Dialog>
    </>
  )
}

InputPopUp.displayName = "InputPopUp"
