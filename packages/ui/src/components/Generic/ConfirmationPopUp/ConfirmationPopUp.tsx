import { Button, Heading } from "@repo/ui/components/Primitive"
import {
  type ButtonProps,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  type DialogProps,
  Flex,
  Text,
  VStack,
} from "@yamada-ui/react"

/**
 * Props for the ConfirmationPopUp component.
 */
export interface ConfirmationPopUpProps extends DialogProps {
  title: string
  subtitle?: string
  closeButton?: boolean
  primaryButton?: ButtonProps & {
    label?: string
  }
  secondaryButton?: ButtonProps & {
    label?: string
  }
}

/**
 * ConfirmationPopUp component that renders a dialog with a title, subtitle, and buttons for confirmation actions.
 *
 * @param closeButton Whether to show the close button in the confirmation pop-up.
 * @param title The title of the confirmation pop-up.
 * @param subtitle Optional subtitle or additional information in the confirmation pop-up.
 * @param primaryButton Configuration for the primary button, including label and click handler.
 * @param secondaryButton Configuration for the secondary button, including label and click handler.
 * @param open Whether the dialog is open or not.
 * @param onClose Function to call when the dialog is closed.
 * @param props Additional props for the dialog component.
 * @returns A confirmation pop-up dialog with title, subtitle, and buttons for user actions.
 */
export const ConfirmationPopUp = ({
  closeButton = true,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  open,
  onClose,
  ...props
}: ConfirmationPopUpProps) => {
  const {
    label: primaryButtonLabel = "Confirm",
    onClick: primaryButtonOnClick,
    ...primaryButtonProps
  } = primaryButton ?? { label: "Confirm" }

  const {
    label: secondaryButtonLabel = "Cancel",
    onClick: secondaryButtonOnClick,
    ...secondaryButtonProps
  } = secondaryButton ?? {}

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
        <Flex align="center" direction={{ base: "column-reverse", md: "row" }} gap="md">
          {(secondaryButton || !closeButton) && (
            <Button
              colorScheme="secondary"
              onClick={secondaryButtonOnClick ?? onClose}
              size="lg"
              {...secondaryButtonProps}
            >
              {secondaryButtonLabel}
            </Button>
          )}
          <Button
            colorScheme="primary"
            onClick={primaryButtonOnClick ?? onClose}
            size="lg"
            {...primaryButtonProps}
          >
            {primaryButtonLabel}
          </Button>
        </Flex>
      </DialogFooter>
    </Dialog>
  )
}

ConfirmationPopUp.displayName = "ConfirmationPopUp"
