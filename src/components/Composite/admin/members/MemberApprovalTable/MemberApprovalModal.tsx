import { TextInput } from '@/components/Generic/TextInput/TextInput'
import { Row } from '@tanstack/react-table'
import { EllipsisIcon } from '@yamada-ui/lucide'
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
} from '@yamada-ui/react'
import { FC, memo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Member } from './columns'

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
    if (data && data.prepaidSessions && data.prepaidSessions > 0) {
      console.log('Form data:', data)
      console.log('Approving member:', row.original)
      onClose()
    } else {
      setError('prepaidSessions', { message: 'Must be at least 1' })
    }
  }

  return (
    <>
      <IconButton
        variant="ghost"
        display={{ base: 'none', lg: 'inline-flex' }}
        bg={['white', 'black']}
        onClick={onOpen}
      >
        <EllipsisIcon w="4" />
      </IconButton>
      <Modal open={open} onClose={onClose}>
        <ModalHeader>Approve Member</ModalHeader>
        <ModalBody>
          <Card variant="outline">
            <CardBody>
              <Text>Member Details</Text>
              <Text>First Name: {row.getValue('firstName')}</Text>
              <Text>Last Name: {row.getValue('lastName')}</Text>
              <Text>Email: {row.getValue('email')}</Text>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="prepaidSessions"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Prepaid Sessions"
                  type="number"
                  {...field}
                  isError={!!errors.prepaidSessions}
                  errorMessage={errors.prepaidSessions?.message}
                />
              )}
            />
            <ButtonGroup placeSelf="flex-end" gap="sm">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="solid" colorScheme="danger" onClick={onClose}>
                Reject
              </Button>
              <Button type="submit" colorScheme="primary" disabled={!isValid || !isDirty}>
                Approve
              </Button>
            </ButtonGroup>
          </VStack>
        </ModalFooter>
      </Modal>
    </>
  )
})

MemberApprovalModal.displayName = 'MemberApprovalModal'
