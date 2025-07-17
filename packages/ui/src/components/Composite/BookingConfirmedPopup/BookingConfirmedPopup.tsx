"use client"

import { MembershipType } from "@repo/shared"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { usePopupState } from "@repo/ui/hooks"
import { StickerIcon } from "@yamada-ui/lucide"
import { Modal, ModalBody, ModalFooter, ModalHeader, type ModalProps, Text } from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"

/**
 * Props for the BookingConfirmedPopup component.
 */
interface BookingConfirmedPopupProps extends ModalProps {
  /**
   * The title text displayed in the popup.
   */
  title: string
  /**
   * The message text displayed in the popup.
   */
  message: string
  /**
   * The additional message text displayed in the popup.
   */
  additionalMessage: string
  /**
   * The initial value of the popup.
   */
  initialValue?: MembershipType
}

/**
 * A modal that displays a booking confirmation message.
 *
 * @param props The props for the modal.
 * @returns The modal component.
 *
 * @example
 * // Basic usage (the popup will open if the search param is set)
 * // To open the popup, set the search param: ?booking-confirmed-popup=open
 * import { BookingConfirmedPopup } from "@repo/ui/components/Composite"
 *
 * <BookingConfirmedPopup />
 */
export const BookingConfirmedPopup: FC<BookingConfirmedPopupProps> = ({
  title,
  message,
  additionalMessage,
  initialValue = MembershipType.member,
  ...props
}) => {
  const { value, close, isOpen } = usePopupState({
    popupId: "booking-confirmed-popup",
    initialValue,
  })

  return (
    <Modal onClose={close} open={isOpen} p="lg" rounded="3xl" size="xl" {...props}>
      <ModalHeader alignItems="center" flexDirection="column">
        <StickerIcon boxSize="2xs" />
        <Heading.h2 fontSize="3xl">{title}</Heading.h2>
      </ModalHeader>
      <ModalBody textAlign="center">
        <Text>{message}</Text>
        {value === MembershipType.casual && additionalMessage && <Text>{additionalMessage}</Text>}
      </ModalBody>
      <ModalFooter alignItems="center" justifyContent="center">
        <Button as={Link} colorScheme="primary" href="/booking">
          View Booking
        </Button>
      </ModalFooter>
    </Modal>
  )
}
