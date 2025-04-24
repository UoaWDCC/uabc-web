import { InputType, TextInput } from "@repo/ui/components/TextInput"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "@yamada-ui/lucide"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
  useDisclosure,
} from "@yamada-ui/react"
import { type FC, memo } from "react"
import { Controller, useForm } from "react-hook-form"
import type { Member } from "./columns"

interface MemberApprovalModalProps {
  row: Row<Member>
}

type FormData = {
  prepaidSessions: number | undefined
}

export const MemberApprovalModal: FC<MemberApprovalModalProps> = memo(({ row }) => {
  const { open, onOpen, onClose } = useDisclosure()

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    defaultValues: { prepaidSessions: 0 },
  })

  const onSubmit = (data: FormData) => {
    if (data?.prepaidSessions && data.prepaidSessions > 0) {
      console.log("Form data:", data)
      console.log("Approving member:", row.original)
      onClose()
    } else {
      setError("prepaidSessions", { message: "Must be at least 1" })
    }
  }

  return (
    <>
      <IconButton
        bg={["white", "black"]}
        display={{ base: "none", lg: "inline-flex" }}
        onClick={onOpen}
        variant="ghost"
      >
        <EllipsisIcon w="4" />
      </IconButton>
      <Modal onClose={onClose} open={open}>
        <ModalHeader>Approve Member</ModalHeader>
        <ModalBody>
          <Card variant="outline">
            <CardBody>
              <Text>Member Details</Text>
              <Text>First Name: {row.getValue("firstName")}</Text>
              <Text>Last Name: {row.getValue("lastName")}</Text>
              <Text>Email: {row.getValue("email")}</Text>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="prepaidSessions"
              render={({ field }) => (
                <TextInput
                  label="Prepaid Sessions"
                  type={InputType.Number}
                  {...field}
                  errorMessage={errors.prepaidSessions?.message}
                  isError={!!errors.prepaidSessions}
                />
              )}
            />
            <ButtonGroup gap="sm" placeSelf="flex-end">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button colorScheme="danger" onClick={onClose} variant="solid">
                Reject
              </Button>
              <Button colorScheme="primary" disabled={!isValid || !isDirty} type="submit">
                Approve
              </Button>
            </ButtonGroup>
          </VStack>
        </ModalFooter>
      </Modal>
    </>
  )
})

MemberApprovalModal.displayName = "MemberApprovalModal"
