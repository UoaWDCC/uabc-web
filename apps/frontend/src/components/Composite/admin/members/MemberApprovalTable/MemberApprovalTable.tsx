"use client"

import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { memo, useMemo, useState } from "react"

import { usePendingMembers } from "@/hooks/query/usePendingMembers"
import {
  Center,
  NativeTable,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@yamada-ui/react"
import {
  MemberApprovalCard,
  MemberApprovalCardEmpty,
  MemberApprovalCardLoading,
} from "./MemberApprovalCard"
import { MemberApprovalTablePagination } from "./MemberApprovalTablePagination"
import { MemberApprovalTableRow } from "./MemberApprovalTableRow"
import { columns } from "./columns"

export const MemberApprovalTable = memo(() => {
  const { data, isLoading } = usePendingMembers()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const pendingMembers = useMemo(
    () =>
      data?.map((member) => {
        return {
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
        }
      }),
    [data],
  )

  const table = useReactTable({
    data: pendingMembers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  return (
    <VStack>
      <VStack display={{ base: "none", lg: "flex" }}>
        {isLoading ? (
          <MemberApprovalCardLoading />
        ) : table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => <MemberApprovalCard key={row.getValue("id")} row={row} />)
        ) : (
          <MemberApprovalCardEmpty />
        )}
      </VStack>
      <TableContainer display={{ lg: "none" }}>
        <NativeTable>
          <Thead>
            <Tr>
              <Th w="200px">Name</Th>
              <Th w="200px">Email</Th>
              <Th w="200px">Set Prepaid Sessions</Th>
              <Th w="200px">Approve</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={4}>
                  <MemberApprovalCardLoading />
                </Td>
              </Tr>
            ) : table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <MemberApprovalTableRow
                    key={row.getValue("id")}
                    userId={row.getValue("id")}
                    row={row}
                  />
                ))
            ) : (
              <Tr>
                <Td colSpan={4} h="24">
                  <MemberApprovalCardEmpty border="none" />
                </Td>
              </Tr>
            )}
          </Tbody>
        </NativeTable>
      </TableContainer>
      {table.getPageCount() > 1 && (
        <Center>
          <MemberApprovalTablePagination
            hasPreviousPage={table.getCanPreviousPage()}
            hasNextPage={table.getCanNextPage()}
            pageIndex={pagination.pageIndex}
            pageCount={table.getPageCount()}
            previousPage={table.previousPage}
            nextPage={table.nextPage}
            setPageIndex={table.setPageIndex}
          />
        </Center>
      )}
    </VStack>
  )
})

MemberApprovalTable.displayName = "MemberApprovalTable"
