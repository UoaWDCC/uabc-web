"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import type { Row } from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useApproveUserMutation, useRejectUserMutation } from "@/hooks/mutations/user"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Button, ButtonGroup, Label, Td, Text, Tr } from "@yamada-ui/react"
import type { Member } from "./columns"

interface MemberApprovalTableRowProps {
  row: Row<Member>
  userId: string
}

const formSchema = z.object({
  prepaidSessions: z.string().min(1, "Field is required").pipe(z.coerce.number().positive()),
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
  const firstName: string = row.getValue("firstName")
  const lastName: string = row.getValue("lastName")
  const email: string = row.getValue("email")

  return (
    <Tr>
      <Td maxW="125px" verticalAlign="middle" w="75px">
        <Text isTruncated>
          {firstName} {lastName}
        </Text>
      </Td>
      <Td maxW="150px" minW="100px" verticalAlign="middle">
        <Text isTruncated>{email}</Text>
      </Td>
      <Td>
        <form onSubmit={handleSubmit(handleApproveClick)}>
          <TextInput
            h="10"
            id={userId}
            type={InputType.Number}
            w="200px"
            {...register("prepaidSessions")}
            errorMessage={errors.prepaidSessions?.message}
            isError={!!errors.prepaidSessions}
          />
        </form>
      </Td>
      <Td>
        <ButtonGroup gap="sm">
          <Button colorScheme="destructive" onClick={handleRejectClick}>
            Reject
          </Button>
          <Button
            colorScheme="primary"
            disabled={!!errors.prepaidSessions || !touchedFields.prepaidSessions}
          >
            <Label htmlFor={userId}>Approve</Label>
          </Button>
        </ButtonGroup>
      </Td>
    </Tr>
  )
}
