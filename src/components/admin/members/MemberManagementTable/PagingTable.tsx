import { noop, TableContainer } from '@yamada-ui/react'
import { type FC, memo, type RefObject, useCallback, useRef } from 'react'
import { MemberManagementTable } from './Table'
import { TablePagination } from './TablePagination'

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
          filterRef={filterRef}
          perPageRef={perPageRef}
          currentPageRef={currentPageRef}
          onTotalPageChange={onTotalPageChange}
        />
      </TableContainer>
      <TablePagination
        totalPageRef={totalPageRef}
        onPerPageChange={onPerPageChange}
        onPageChange={onPageChange}
      />
    </>
  )
})

PagingTable.displayName = 'PagingTable'
