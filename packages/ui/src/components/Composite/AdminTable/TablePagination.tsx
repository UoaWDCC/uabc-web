import { Grid, GridItem, Option, Pagination } from "@yamada-ui/react"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { Select } from "../../Primitive"
import { useMemberManagement } from "./MemberManagementContext"

export const TablePagination: FC = memo(() => {
  const { currentPage, setCurrentPage, perPage, setPerPage, totalPages } = useMemberManagement()

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
          onChange={handlePageChange}
          page={currentPage}
          total={totalPages}
          withEdges
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
