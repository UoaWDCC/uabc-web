"use client"

import { Button, Heading, PinInput } from "@repo/ui/components/Primitive"
import { ShieldIcon } from "@yamada-ui/lucide"
import {
  Center,
  FormControl,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  Text,
  useLoading,
  useNotice,
} from "@yamada-ui/react"
import { type FC, useRef } from "react"
import { Controller, useForm } from "react-hook-form"

export interface CodeVerificationPopupData {
  pinInput: string
}

/**
 * Props for the CodeVerificationPopup component.
 */
interface CodeVerificationPopupProps extends Omit<ModalProps, "onSubmit"> {
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
  additionalMessage?: string
  /**
   * The onSubmit handler.
   */
  onSubmit?: (data: CodeVerificationPopupData) => Promise<boolean>
  /**
   * The error message to display if the submission fails.
   */
  errorMessage?: string
  /**
   * Whether the popup is loading.
   */
  isLoading?: boolean
}

/**
 * A modal that displays a code verification message.
 *
 * @param props The props for the modal.
 * @returns The modal component.
 *
 * @example
 * // Basic usage (the popup will open if the search param is set)
 * // To open the popup, set the search param: ?code-verification-popup=open
 * import { CodeVerificationPopup } from "@repo/ui/components/Composite"
 *
 * <CodeVerificationPopup />
 */
export const CodeVerificationPopup: FC<CodeVerificationPopupProps> = ({
  title,
  message,
  additionalMessage,
  onSubmit,
  errorMessage,
  isLoading,
  ...props
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodeVerificationPopupData>()
  const { page } = useLoading()
  const notice = useNotice()

  const handleSubmission = async (data: CodeVerificationPopupData) => {
    page.start()

    if (onSubmit) {
      const success = await onSubmit(data)
      if (success) {
        notice({
          title: "Success",
          description: "The code has been verified.",
          status: "success",
        })
      }
    }
    page.finish()
  }

  return (
    <Modal
      as="form"
      onClose={close}
      onSubmit={handleSubmit(handleSubmission)}
      p="lg"
      ref={formRef}
      rounded="3xl"
      size="xl"
      {...props}
    >
      <ModalHeader alignItems="center" flexDirection="column">
        <ShieldIcon boxSize="2xs" />
        <Heading.h2 fontSize="3xl">{title}</Heading.h2>
      </ModalHeader>
      <ModalBody alignItems="center" overflow="visible" textAlign="center">
        <Text>{message}</Text>
        {additionalMessage && <Text>{additionalMessage}</Text>}
        <FormControl
          as={Center}
          errorMessage={errors.pinInput ? errors.pinInput.message : errorMessage}
          flexDirection="column"
          invalid={!!errors.pinInput || !!errorMessage}
        >
          <Controller
            control={control}
            name="pinInput"
            render={({ field }) => (
              <PinInput
                items={6}
                onComplete={(data) => handleSubmission({ pinInput: data })}
                otp
                placeholder=""
                size="md"
                {...field}
              />
            )}
            rules={{
              required: { value: true, message: "This is required." },
              minLength: { value: 6, message: "This is required." },
            }}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter alignItems="center" justifyContent="center">
        <Button
          colorScheme="primary"
          loading={isSubmitting || isLoading}
          loadingText="Verifying..."
          type="submit"
        >
          Verify
        </Button>
      </ModalFooter>
    </Modal>
  )
}
