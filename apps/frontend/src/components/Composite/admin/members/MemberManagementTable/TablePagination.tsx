import { Grid, GridItem, Option, Pagination, Select, assignRef } from "@yamada-ui/react"
import type { FC, RefObject } from "react"
import { memo, useCallback, useState } from "react"

interface TableProps {
  totalPageRef: RefObject<(value: number) => void>
  onPerPageChange: (value: number) => void
  onPageChange: (page: number) => void
}

export const TablePagination: FC<TableProps> = memo(
  ({ totalPageRef, onPerPageChange, onPageChange }) => {
    const [pages, setPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    const handlePageChange = useCallback(
      (page: number) => {
        setCurrentPage(page)
        onPageChange(page)
      },
      [onPageChange],
    )

    const handlePerPageChange = useCallback(
      (value: string) => {
        handlePageChange(1)
        onPerPageChange(Number.parseInt(value))
      },
      [handlePageChange, onPerPageChange],
    )

    assignRef(totalPageRef, setPages)

    return (
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap="md" placeItems="center">
        <GridItem />
        <GridItem>
          <Pagination page={currentPage} total={pages} onChange={handlePageChange} withEdges />
        </GridItem>
        <GridItem>
          <Select onChange={handlePerPageChange} defaultValue="20" w="32">
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
            <Option value="100">100</Option>
          </Select>
        </GridItem>
      </Grid>
    )
  },
)

TablePagination.displayName = "TablePagination"
