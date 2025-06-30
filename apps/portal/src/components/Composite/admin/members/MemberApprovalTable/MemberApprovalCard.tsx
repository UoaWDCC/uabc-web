import type { Row } from "@tanstack/react-table"
import { UsersIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardFooter,
  CardHeader,
  Center,
  EmptyState,
  EmptyStateDescription,
  EmptyStateIndicator,
  type EmptyStateProps,
  EmptyStateTitle,
  Loading,
  Spacer,
  Text,
} from "@yamada-ui/react"
import { type FC, memo } from "react"
import type { Member } from "./columns"
import { MemberApprovalModal } from "./MemberApprovalModal"

interface MemberApprovalCardProps {
  row: Row<Member>
}

export const MemberApprovalCard: FC<MemberApprovalCardProps> = memo(({ row }) => {
  return (
    <Card bg="blackAlpha.50" flexDir="row" key={row.getValue("id")} py="md">
      <CardHeader pt="0">
        <Text>
          {row.getValue("firstName")} {row.getValue("lastName")}
        </Text>
      </CardHeader>
      <Spacer />
      <CardFooter pb="0">
        <MemberApprovalModal row={row} />
      </CardFooter>
    </Card>
  )
})

MemberApprovalCard.displayName = "MemberApprovalCard"

export const MemberApprovalCardEmpty: FC<EmptyStateProps> = memo(({ ...props }) => {
  return (
    <EmptyState borderColor="border" borderWidth="1px" p="lg" rounded="md" {...props}>
      <EmptyStateIndicator>
        <UsersIcon />
      </EmptyStateIndicator>
      <EmptyStateTitle>No pending members</EmptyStateTitle>
      <EmptyStateDescription>There are no pending members to approve.</EmptyStateDescription>
    </EmptyState>
  )
})

MemberApprovalCardEmpty.displayName = "MemberApprovalCardEmpty"

export const MemberApprovalCardLoading = memo(() => {
  return (
    <Center>
      <Loading fontSize="7xl" />
    </Center>
  )
})

MemberApprovalCardLoading.displayName = "MemberApprovalCardLoading"
