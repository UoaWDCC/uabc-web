import { FC, memo } from 'react'
import {
  Card,
  CardHeader,
  CardFooter,
  Text,
  Spacer,
  Center,
  Loading,
  EmptyState,
  EmptyStateIndicator,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateProps,
} from '@yamada-ui/react'
import { Row } from '@tanstack/react-table'
import { MemberApprovalModal } from './MemberApprovalModal'
import { Member } from './columns'
import { UsersIcon } from '@yamada-ui/lucide'

interface MemberApprovalCardProps {
  row: Row<Member>
}

export const MemberApprovalCard: FC<MemberApprovalCardProps> = memo(({ row }) => {
  return (
    <Card key={row.getValue('id')} flexDir="row" py="md" bg="blackAlpha.50">
      <CardHeader pt="0">
        <Text>
          {row.getValue('firstName')} {row.getValue('lastName')}
        </Text>
      </CardHeader>
      <Spacer />
      <CardFooter pb="0">
        <MemberApprovalModal row={row} />
      </CardFooter>
    </Card>
  )
})

MemberApprovalCard.displayName = 'MemberApprovalCard'

export const MemberApprovalCardEmpty: FC<EmptyStateProps> = memo(({ ...props }) => {
  return (
    <EmptyState borderWidth="1px" borderColor="border" rounded="md" p="lg" {...props}>
      <EmptyStateIndicator>
        <UsersIcon />
      </EmptyStateIndicator>
      <EmptyStateTitle>No pending members</EmptyStateTitle>
      <EmptyStateDescription>There are no pending members to approve.</EmptyStateDescription>
    </EmptyState>
  )
})

MemberApprovalCardEmpty.displayName = 'MemberApprovalCardEmpty'

export const MemberApprovalCardLoading = memo(() => {
  return (
    <Center>
      <Loading fontSize="7xl" />
    </Center>
  )
})

MemberApprovalCardLoading.displayName = 'MemberApprovalCardLoading'
