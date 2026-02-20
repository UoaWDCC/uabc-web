import { Button, Heading } from "@repo/ui/components/Primitive"
import {
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogFooter,
  type DialogProps,
  Text,
  VStack,
} from "@yamada-ui/react"

/**
 * Props for the {@link SemesterCreatedPopUp} component.
 */
export interface SemesterCreatedPopUpProps extends DialogProps {
  /**
   * Text to display in the confirmation pop-up title.
   */
  title: string
  /**
   * Optional subtitle or additional information in the confirmation pop-up.
   */
  subtitle?: string

  /**
   * Handler called when the user clicks close button and closes the dialog.
   */
  onClose: () => void
}

/**
 * A dialog component that displays a confirmation pop-up after a semester is created.
 *
 * The `SemesterCreatedPopUp` shows a customizable title and optional subtitle,
 * and provides a close button to dismiss the dialog. It extends the base `DialogProps`
 * from `@yamada-ui/react` for additional dialog configuration.
 *
 * @remarks
 * This component is typically used as the final step in a semester creation flow,
 * providing feedback to the user that the process has completed successfully.
 *
 * @example
 * ```tsx
 * <SemesterCreatedPopUp
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Semester Created"
 *   subtitle="The new semester has been successfully created."
 * />
 * ```
 *
 * @param props - {@link SemesterCreatedPopUpProps} including dialog configuration, title, subtitle, and close handler.
 */
export const SemesterCreatedPopUp = ({
  title,
  subtitle,
  onClose,
  ...props
}: SemesterCreatedPopUpProps) => {
  return (
    <Dialog
      borderRadius="3xl"
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
      gap={{ base: "md", md: "lg" }}
      layerStyle="gradientBorder"
      onClose={onClose}
      px="lg"
      py="xl"
      size="3xl"
      {...props}
    >
      <DialogBody justifyContent="center" w="full">
        <VStack align="center" gap="md">
          <Heading.h2 fontSize="3xl" textAlign="center">
            {title}
          </Heading.h2>
          <Text textAlign="center" whiteSpace="pre-line">
            {subtitle}
          </Text>
        </VStack>
      </DialogBody>
      <DialogFooter justifyContent="center" w="full">
        <ButtonGroup flexDirection={{ base: "column-reverse", md: "row" }} gap="md">
          <Button colorScheme="primary" onClick={onClose} size="lg">
            Close
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

SemesterCreatedPopUp.displayName = "SemesterCreatedPopUp"
