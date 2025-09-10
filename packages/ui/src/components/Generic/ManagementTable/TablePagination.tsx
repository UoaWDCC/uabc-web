import { Select } from "@repo/ui/components/Primitive"
import { Grid, GridItem, Option, Pagination } from "@yamada-ui/react"
import { memo, useCallback } from "react"
import { useManagementTable } from "./MemberManagementContext"

interface TablePaginationProps {
  /**
   * If `true`, will show the first and last page buttons.
   *
   * @default true
   */
  withEdges?: boolean
}

export const TablePagination = memo(({ withEdges = true }: TablePaginationProps) => {
  const { currentPage, setCurrentPage, perPage, setPerPage, totalPages } = useManagementTable()

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage],
  )

  const handlePerPageChange = useCallback(
    (value: string) => {
      setPerPage(Number.parseInt(value))
    },
    [setPerPage],
  )

  return (
    <Grid gap="md" gridTemplateColumns="repeat(3, 1fr)" placeItems="center">
      <GridItem />
      <GridItem>
        <Pagination
          colorScheme="secondary"
          disabled={totalPages === 0}
          onChange={handlePageChange}
          page={currentPage}
          total={totalPages}
          withEdges={withEdges}
        />
      </GridItem>
      <GridItem display="grid" placeSelf="end">
        <Select defaultValue={perPage.toString()} onChange={handlePerPageChange} size="md" w="32">
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
          <Option value="100">100</Option>
        </Select>
      </GridItem>
    </Grid>
  )
})

TablePagination.displayName = "TablePagination"
