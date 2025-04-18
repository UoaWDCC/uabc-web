'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useApproveUserMutation, useRejectUserMutation } from '@/hooks/mutations/user'
import { Button, ButtonGroup, Label, Td, Text, Tr } from '@yamada-ui/react'
import { TextInput } from '../../../TextInput'
import type { Member } from './columns'

interface MemberApprovalTableRowProps {
  row: Row<Member>
  userId: string
}

const formSchema = z.object({
  prepaidSessions: z.string().min(1, 'Field is required').pipe(z.coerce.number().positive()),
})

export function MemberApprovalTableRow({ row, userId }: MemberApprovalTableRowProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const queryClient = useQueryClient()

  const { mutate: approveUser } = useApproveUserMutation(queryClient)
  const { mutate: rejectUser } = useRejectUserMutation(queryClient)

  const handleRejectClick = () => {
    rejectUser({ userId })
  }

  const handleApproveClick = ({ prepaidSessions }: z.infer<typeof formSchema>) => {
    approveUser({ userId, prepaidSessions })
  }
  const firstName: string = row.getValue('firstName')
  const lastName: string = row.getValue('lastName')
  const email: string = row.getValue('email')

  return (
    <Tr>
      <Td w="75px" maxW="125px" verticalAlign="middle">
        <Text isTruncated>
          {firstName} {lastName}
        </Text>
      </Td>
      <Td minW="100px" maxW="150px" verticalAlign="middle">
        <Text isTruncated>{email}</Text>
      </Td>
      <Td>
        <form onSubmit={handleSubmit(handleApproveClick)}>
          <TextInput
            type="number"
            h="10"
            w="200px"
            {...register('prepaidSessions')}
            isError={!!errors.prepaidSessions}
            errorMessage={errors.prepaidSessions?.message}
          />
          <input type="submit" id={userId} className="hidden" />
        </form>
      </Td>
      <Td>
        <ButtonGroup gap="sm">
          <Button colorScheme="destructive" onClick={handleRejectClick}>
            Reject
          </Button>
          <Button
            disabled={!!errors.prepaidSessions || !touchedFields.prepaidSessions}
            colorScheme="primary"
          >
            <Label htmlFor={userId}>Approve</Label>
          </Button>
        </ButtonGroup>
      </Td>
    </Tr>
  )
}
