import { TableContainer, noop } from "@yamada-ui/react"
import { type FC, type RefObject, memo, useCallback, useRef } from "react"
import { MemberManagementTable } from "./Table"
import { TablePagination } from "./TablePagination"

interface PagingTableProps {
  filterRef: RefObject<(value: string) => void>
}

export const PagingTable: FC<PagingTableProps> = memo(({ filterRef }) => {
  const totalPageRef = useRef<(value: number) => void>(noop) // total pages for pagination
  const perPageRef = useRef<(value: number) => void>(noop) // number of items per page
  const currentPageRef = useRef<(value: number) => void>(noop) // current page number

  const onTotalPageChange = useCallback((value: number) => {
    totalPageRef.current(value)
  }, [])

  const onPerPageChange = useCallback((value: number) => {
    perPageRef.current(value)
  }, [])

  const onPageChange = useCallback((value: number) => {
    currentPageRef.current(value)
  }, [])

  return (
    <>
      <TableContainer>
        <MemberManagementTable
          currentPageRef={currentPageRef}
          filterRef={filterRef}
          onTotalPageChange={onTotalPageChange}
          perPageRef={perPageRef}
        />
      </TableContainer>
      <TablePagination
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        totalPageRef={totalPageRef}
      />
    </>
  )
})

PagingTable.displayName = "PagingTable"
