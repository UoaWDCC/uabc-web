import { Button, Heading } from "@repo/ui/components/Primitive"
import {
  ButtonGroup,
  type ButtonProps,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  type DialogProps,
  Text,
  VStack,
} from "@yamada-ui/react"

/**
 * Props for the {@link ConfirmationPopUp} component.
 */
export interface ConfirmationPopUpProps extends DialogProps {
  /**
   * Text to display in the confirmation pop-up title.
   */
  title: string
  /**
   * Optional subtitle or additional information in the confirmation pop-up.
   */
  subtitle?: string
  /**
   * Whether to show the close button in the confirmation pop-up.
   */
  closeButton?: boolean
  /**
   * Configuration for the confirm button on the right/top, including label and click handler.
   */
  confirmButton?: ButtonProps & {
    /**
     * Label for the confirm button.
     */
    label?: string
  }
  /**
   * Configuration for the cancel button on the left/bottom, including label and click handler.
   */
  cancelButton?: ButtonProps & {
    /**
     * Label for the cancel button.
     */
    label?: string
  }
}

/**
 * ConfirmationPopUp component that renders a dialog with a title, subtitle, and buttons for confirmation actions.
 *
 * @param closeButton Whether to show the close button in the confirmation pop-up.
 * @param title The title of the confirmation pop-up.
 * @param subtitle Optional subtitle or additional information in the confirmation pop-up.
 * @param confirmButton Configuration for the confirm button, including label and click handler.
 * @param cancelButton Configuration for the cancel button, including label and click handler.
 * @param open Whether the dialog is open or not.
 * @param onClose Function to call when the dialog is closed.
 * @param props Additional props for the dialog component.
 * @returns A confirmation pop-up dialog with title, subtitle, and buttons for user actions.
 * @example
 * <ConfirmationPopUp
 *  title="Delete Account"
 *  subtitle="Are you sure you want to delete your account?"
 *  closeButton={false}
 *  confirmButton={{ label: "Delete", onClick: handleDelete }}
 *  cancelButton={{ label: "Cancel" }}
 *  open={isOpen}
 *  onClose={handleClose}
 * />
 */
export const ConfirmationPopUp = ({
  closeButton = true,
  title,
  subtitle,
  confirmButton,
  cancelButton,
  open,
  onClose,
  ...props
}: ConfirmationPopUpProps) => {
  const {
    label: confirmButtonLabel = "Confirm",
    onClick: confirmButtonOnClick = onClose,
    ...confirmButtonProps
  } = confirmButton ?? { label: "Confirm" }

  const {
    label: cancelButtonLabel = "Cancel",
    onClick: cancelButtonOnClick = onClose,
    ...cancelButtonProps
  } = cancelButton ?? {}

  return (
    <Dialog
      borderRadius="3xl"
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
      gap={{ base: "md", md: "lg" }}
      layerStyle="gradientBorder"
      onClose={closeButton ? onClose : undefined}
      open={open}
      px="lg"
      py="xl"
      size="3xl"
      {...props}
    >
      {closeButton && (
        <DialogCloseButton
          bg="black"
          borderRadius="full"
          layerStyle="gradientBorder"
          right="md"
          size="md"
          top="md"
        />
      )}
      <DialogBody justifyContent="center" w="full">
        <VStack align="center" gap="md">
          <Heading.h2 fontSize="3xl" textAlign="center">
            {title}
          </Heading.h2>
          <Text textAlign="center">{subtitle}</Text>
        </VStack>
      </DialogBody>
      <DialogFooter justifyContent="center" w="full">
        <ButtonGroup flexDirection={{ base: "column-reverse", md: "row" }} gap="md">
          {(cancelButton || !closeButton) && (
            <Button
              colorScheme="secondary"
              onClick={cancelButtonOnClick}
              size="lg"
              {...cancelButtonProps}
            >
              {cancelButtonLabel}
            </Button>
          )}
          <Button
            colorScheme="primary"
            onClick={confirmButtonOnClick}
            size="lg"
            {...confirmButtonProps}
          >
            {confirmButtonLabel}
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

ConfirmationPopUp.displayName = "ConfirmationPopUp"
