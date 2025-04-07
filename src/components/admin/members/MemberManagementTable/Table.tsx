'use client'

import type { TdProps } from '@yamada-ui/react'
import type { Cell, Column, PagingTableProps } from '@yamada-ui/table'
import { useMembers } from '@/hooks/query/useMembers'
import type { Member } from '@/types/member'
import { useMemo, useState, memo, RefObject } from 'react'
import { assignRef } from '@yamada-ui/react'
import { Button, HStack, Text, Center, Loading } from '@yamada-ui/react'
import { PagingTable } from '@yamada-ui/table'

export interface MemberManagementTableProps {
  filterRef: RefObject<(value: string) => void>
}

export const MemberManagementTable = memo(({ filterRef }: MemberManagementTableProps) => {
  const { data, isLoading } = useMembers()
  const [filterValue, setFilterValue] = useState('')

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

  const filteredMembers = useMemo(() => {
    if (!filterValue) return members
    const lowercaseFilter = filterValue.toLowerCase()
    return members?.filter(
      (member) =>
        member.name.toLowerCase().includes(lowercaseFilter) ||
        member.email.toLowerCase().includes(lowercaseFilter) ||
        member.prepaidSessions.toString().includes(lowercaseFilter),
    )
  }, [members, filterValue])

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

  const cellProps = useMemo<PagingTableProps<Member>['cellProps']>(() => {
    return ({ column, row }: Cell<Member & { empty?: boolean }, unknown>) => {
      const props: TdProps = { verticalAlign: 'middle' }

      if (row.original.empty) {
        if (column.columnDef.header === 'Name') {
          props.colSpan = 5
          props.textAlign = 'center'
          props.color = 'muted'
          props.h = '3xs'
        } else {
          props.display = 'none'
        }
      }

      if (column.columnDef.header === 'Actions') {
        props.py = 2
      }

      return props
    }
  }, [])

  assignRef(filterRef, setFilterValue)

  if (isLoading) {
    return (
      <Center>
        <Loading fontSize="5xl" />
      </Center>
    )
  }

  const hasData = !!filteredMembers?.length

  const resolvedData = hasData
    ? filteredMembers
    : [
        {
          id: '',
          name: 'No members found',
          email: '',
          prepaidSessions: 0,
          empty: true,
        },
      ]

  return (
    <PagingTable<Member & { empty?: boolean }>
      sx={{ 'tbody > tr:last-of-type > td': { borderBottomWidth: '0px' } }}
      borderCollapse="separate"
      borderWidth="1px"
      columns={columns}
      data={resolvedData}
      rowId="id"
      cellProps={cellProps}
      withPagingControl={hasData}
      highlightOnHover={hasData}
      highlightOnSelected={hasData}
      rowsClickSelect={hasData}
      rounded="md"
    />
  )
})

MemberManagementTable.displayName = 'MemberManagementTable'
