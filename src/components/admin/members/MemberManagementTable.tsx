'use client'

import type { TdProps } from '@yamada-ui/react'
import type { Cell, Column, PagingTableProps } from '@yamada-ui/table'
import { useMembers } from '@/hooks/query/useMembers'
import type { Member } from '@/types/member'
import { useMemo } from 'react'
import { Button, HStack, TableContainer, Text, EmptyState, Center, Loading } from '@yamada-ui/react'
import { PagingTable } from '@yamada-ui/table'
import { UsersIcon } from '@yamada-ui/lucide'

export function MemberManagementTable() {
  const { data, isLoading } = useMembers()

  const members = useMemo(
    () =>
      data?.map((member) => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        prepaidSessions: member.prepaidSessions,
      })),
    [data],
  )

  const columns = useMemo<Column<Member>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        css: { w: '200px' },
        cell: ({ getValue }) => (
          <Text as="span" lineClamp={1}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <Text as="span" lineClamp={1}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        accessorKey: 'prepaidSessions',
        header: 'Prepaid Sessions',
        css: { w: '200px', textAlign: 'center' },
        cell: ({ getValue }) => (
          <Text as="span" textAlign="center" display="block">
            {getValue() as number}
          </Text>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        css: { w: '200px', textAlign: 'center' },
        cell: () => (
          <HStack justify="center">
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </HStack>
        ),
      },
    ],
    [],
  )

  const cellProps: PagingTableProps<Member>['cellProps'] = ({ column }: Cell<Member, unknown>) => {
    const props: TdProps = { verticalAlign: 'middle' }

    if (column.columnDef.header === 'Actions') {
      props.p = 4
    }

    return props
  }

  if (isLoading) {
    return (
      <Center>
        <Loading fontSize="5xl" />
      </Center>
    )
  }

  if (!members?.length) {
    return (
      <EmptyState
        title="No members found"
        description="There are currently no members in the system"
        indicator={<UsersIcon />}
      />
    )
  }

  return (
    <TableContainer rounded="md" borderWidth="1px" pb="md" px="md">
      <PagingTable<Member>
        columns={columns}
        data={members ?? []}
        rowId="id"
        cellProps={cellProps}
        withPagingControl
        highlightOnHover
        highlightOnSelected
        rounded="md"
      />
    </TableContainer>
  )
}
