'use client'

import { type AttendeesListResponse, useAttendees } from '@/hooks/query/useAttendees'
import type { TdProps } from '@yamada-ui/react'
import {
  Badge,
  Center,
  Checkbox,
  Loading,
  NativeTable,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  assignRef,
} from '@yamada-ui/react'
import type { Cell, Column, PagingTableProps } from '@yamada-ui/table'
import { PagingTable } from '@yamada-ui/table'
import { type RefObject, memo, useMemo, useState } from 'react'

type ExtendedAttendee = AttendeesListResponse & {
  name: string
  empty?: boolean
}

export interface AttendeesTableProps {
  filterRef: RefObject<(value: string) => void>
  gameSessionId: number
}

export const AttendeesTable = memo(({ filterRef, gameSessionId }: AttendeesTableProps) => {
  const { data, isLoading } = useAttendees(gameSessionId)
  const [filterValue, setFilterValue] = useState('')

  const attendees = useMemo(
    () =>
      data?.map((attendee) => ({
        ...attendee,
        name: `${attendee.firstName} ${attendee.lastName}`,
      })),
    [data],
  )

  const filteredAttendees = useMemo(() => {
    if (!filterValue) return attendees
    const lowercaseFilter = filterValue.toLowerCase()
    return attendees?.filter(
      (attendee) =>
        attendee.name.toLowerCase().includes(lowercaseFilter) ||
        attendee.email.toLowerCase().includes(lowercaseFilter) ||
        attendee.playLevel.toLowerCase().includes(lowercaseFilter),
    )
  }, [attendees, filterValue])

  const columns = useMemo<Column<ExtendedAttendee>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        css: { w: '200px' },
        cell: ({ row }) => (
          <Text as="span" lineClamp={1}>
            {row.original.name}
            {row.original.pro && <Badge ml="2">Pro</Badge>}
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
        accessorKey: 'playLevel',
        header: 'Play Level',
        css: { w: '150px', textAlign: 'center' },
        cell: ({ getValue }) => (
          <Text as="span" textAlign="center" display="block" textTransform="capitalize">
            {getValue() as string}
          </Text>
        ),
      },
      {
        accessorKey: 'member',
        header: 'Member',
        css: { w: '150px', textAlign: 'center' },
        cell: ({ getValue }) => (
          <Text as="span" textAlign="center" display="block">
            {getValue() ? 'Yes' : 'No'}
          </Text>
        ),
      },
    ],
    [],
  )

  const cellProps = useMemo<PagingTableProps<ExtendedAttendee>['cellProps']>(() => {
    return ({ column, row }: Cell<ExtendedAttendee, unknown>) => {
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
      <TableContainer>
        <NativeTable borderCollapse="separate" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th w="0" px="3" py="2">
                <Center h="full">
                  <Checkbox disabled />
                </Center>
              </Th>
              <Th w="200px">Name</Th>
              <Th>Email</Th>
              <Th w="150px" textAlign="center">
                Play Level
              </Th>
              <Th w="150px" textAlign="center">
                Member
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td colSpan={5} h="3xs">
                <Center h="full">
                  <Loading fontSize="5xl" />
                </Center>
              </Td>
            </Tr>
          </Tbody>
        </NativeTable>
      </TableContainer>
    )
  }

  const hasData = !!filteredAttendees?.length

  const resolvedData: ExtendedAttendee[] = hasData
    ? filteredAttendees
    : [
        {
          id: 0,
          firstName: '',
          lastName: '',
          name: 'No Attendees',
          email: '',
          playLevel: 'beginner',
          member: false,
          pro: false,
          empty: true,
        },
      ]

  return (
    <PagingTable<ExtendedAttendee>
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

AttendeesTable.displayName = 'AttendeesTable'
