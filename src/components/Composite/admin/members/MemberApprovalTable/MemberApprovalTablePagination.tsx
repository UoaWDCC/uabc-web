import { Pagination, PaginationProps } from '@yamada-ui/react' // Adjust the import path as needed
import { memo } from 'react'

interface MemberApprovalTablePaginationProps {
  hasPreviousPage: boolean
  hasNextPage: boolean
  pageIndex: number
  pageCount: number
  previousPage: () => void
  nextPage: () => void
  setPageIndex: (index: number) => void
}

export const MemberApprovalTablePagination: React.FC<MemberApprovalTablePaginationProps> = memo(
  ({
    hasPreviousPage,
    hasNextPage,
    pageIndex,
    pageCount,
    previousPage,
    nextPage,
    setPageIndex,
  }) => {
    const paginationProps: PaginationProps = {
      page: pageIndex + 1,
      total: pageCount,
      onChange: (newPage) => {
        setPageIndex(newPage - 1)
      },
      isDisabled: !hasPreviousPage && !hasNextPage,
      withControls: true,
      withEdges: true,
      controlNextProps: {
        isDisabled: !hasNextPage,
        onClick: nextPage,
      },
      controlPrevProps: {
        isDisabled: !hasPreviousPage,
        onClick: previousPage,
      },
    }

    return <Pagination size={{ base: 'md', md: 'sm' }} {...paginationProps} />
  },
)

MemberApprovalTablePagination.displayName = 'MemberApprovalTablePagination'
