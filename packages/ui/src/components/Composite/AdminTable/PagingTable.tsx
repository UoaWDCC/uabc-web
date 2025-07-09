import { TableContainer, VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { MemberManagementTable } from "./Table"
import { TablePagination } from "./TablePagination"

export const PagingTable: FC = memo(() => {
  return (
    <VStack gap="md" w="full">
      <TableContainer>
        <MemberManagementTable />
      </TableContainer>
      <TablePagination />
    </VStack>
  )
})

PagingTable.displayName = "PagingTable"
