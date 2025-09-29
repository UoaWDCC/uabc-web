"use client"

import type { User } from "@repo/shared/payload-types"
import type { PaginationQuery } from "@repo/shared/types"
import { ManagementTable } from "@repo/ui/components/Generic"
import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Dialog, useDisclosure } from "@yamada-ui/react"
import dayjs from "dayjs"
import { parseAsArrayOf, parseAsInteger, parseAsJson, parseAsString, useQueryStates } from "nuqs"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import type { FieldFiltersFromConfig } from "../../Generic/ManagementTable/Filter"
import { columns, type UserData } from "./Columns"
import { COLUMNS_CONFIG, FILTER_CONFIGS } from "./constants"

const ALL_COLUMN_KEYS = [
  "name",
  "email",
  "remaining",
  "joined",
  "role",
  "university",
  "level",
  "actions",
] as (keyof UserData & string)[]

type TConfigs = typeof FILTER_CONFIGS

/**
 * Props for the admin table with paginated data component.
 */
interface AdminTableWithPaginatedDataProps {
  useGetPaginatedData: (params: Omit<PaginationQuery, "page">) => UseInfiniteQueryResult<
    {
      pages: Array<{
        data: {
          docs: User[]
          totalDocs: number
          limit: number
          page: number
          totalPages: number
          hasNextPage: boolean
          hasPrevPage: boolean
        }
      }>
      pageParams: unknown[]
    },
    Error
  >
  onDelete?: (id: string) => void
  paginationWithEdges?: boolean
}

/**
 * A table for admin to manage users where the data is fetched with pagination.
 *
 * @param useGetPaginatedData - A `useInfiniteQuery` hook to fetch paginated data.
 * @param onDelete - A callback function to handle user deletion.
 * @param paginationWithEdges - Whether to show first and last page buttons in pagination.
 * @returns A memoized admin table component that fetches paginated data.
 */
export const AdminTableWithPaginatedQuery = memo(
  ({
    useGetPaginatedData,
    paginationWithEdges = true,
    ...props
  }: AdminTableWithPaginatedDataProps) => {
    const { open, onOpen, onClose } = useDisclosure()
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [isFetchingPages, setIsFetchingPages] = useState(false)
    const [searchParams, setSearchParams] = useQueryStates(
      {
        page: parseAsInteger.withDefault(1),
        perPage: parseAsInteger.withDefault(20),
        filter: parseAsString.withDefault(""),
        columns: parseAsArrayOf(parseAsString).withDefault(ALL_COLUMN_KEYS),
        selectedRows: parseAsArrayOf(parseAsString).withDefault([]),
        fieldFilters: parseAsJson<FieldFiltersFromConfig<UserData, TConfigs>>(
          (value) => value as FieldFiltersFromConfig<UserData, TConfigs>,
        ).withDefault({} as FieldFiltersFromConfig<UserData, TConfigs>),
      },
      {
        clearOnDefault: true,
      },
    )

    const {
      data: queriedData,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useGetPaginatedData({
      limit: searchParams.perPage,
      query: searchParams.filter,
      filter: JSON.stringify(searchParams.fieldFilters),
    })

    const currentPageCount = queriedData?.pages?.length || 0
    const needsMorePages = searchParams.page > currentPageCount

    useEffect(() => {
      const fetchRequiredPages = async () => {
        if (needsMorePages && hasNextPage && !isFetchingNextPage && !isFetchingPages) {
          setIsFetchingPages(true)
          try {
            let pagesToFetch = searchParams.page - currentPageCount
            while (pagesToFetch > 0 && hasNextPage) {
              await fetchNextPage()
              pagesToFetch--
            }
          } finally {
            setIsFetchingPages(false)
          }
        }
      }

      fetchRequiredPages()
    }, [
      searchParams.page,
      currentPageCount,
      hasNextPage,
      isFetchingNextPage,
      isFetchingPages,
      fetchNextPage,
      needsMorePages,
    ])

    const paginationMetadata = useMemo(() => {
      const totalDocs = queriedData?.pages?.[0]?.data?.totalDocs || 0
      const currenUserDataCount =
        queriedData?.pages?.reduce((total, page) => total + (page?.data?.docs?.length || 0), 0) || 0
      const totalPagesForCurrentPerPage = Math.ceil(totalDocs / searchParams.perPage)
      const currentPageForCurrentPerPage = searchParams.page

      const hasValidData = totalDocs > 0
      const calculatedHasNextPage = hasValidData
        ? currentPageForCurrentPerPage < totalPagesForCurrentPerPage
        : true

      return {
        totalPages: hasValidData
          ? totalPagesForCurrentPerPage
          : Math.max(currentPageForCurrentPerPage, 1),
        hasNextPage: calculatedHasNextPage,
        hasPrevPage: currentPageForCurrentPerPage > 1,
        totalDocs: totalDocs,
        currenUserDataCount: currenUserDataCount,
      }
    }, [queriedData?.pages, searchParams.perPage, searchParams.page])

    const data: UserData[] = useMemo(() => {
      const currentUsers = queriedData?.pages.flatMap((page) => page.data?.docs || []) || []

      const mappedData = currentUsers.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName || ""}`,
        email: user.email,
        remaining: String(user.remainingSessions),
        joined: dayjs(user.createdAt).format("DD MMM YYYY hh:mm A"),
        role: user.role,
        university: user.university || "",
        level: user.playLevel || "",
      }))

      return mappedData
    }, [queriedData?.pages])

    const handlePageChange = useCallback(
      async (targetPage: number) => {
        const pagesNeeded = targetPage - currentPageCount
        if (pagesNeeded > 0 && hasNextPage && !isFetchingPages) {
          setIsFetchingPages(true)
          try {
            for (let i = 0; i < pagesNeeded; i++) {
              if (hasNextPage) {
                await fetchNextPage()
              }
            }
          } finally {
            setIsFetchingPages(false)
          }
        }
      },
      [currentPageCount, hasNextPage, isFetchingPages, fetchNextPage],
    )

    const handlePerPageChange = useCallback(
      async (newPerPage: number) => {
        const rowsToFetch = newPerPage * searchParams.page - data.length
        if (rowsToFetch > 0 && hasNextPage && !isFetchingPages) {
          setIsFetchingPages(true)
          try {
            const pagesNeeded = Math.ceil(rowsToFetch / newPerPage)
            for (let i = 0; i < pagesNeeded; i++) {
              if (hasNextPage) {
                await fetchNextPage()
              }
            }
          } finally {
            setIsFetchingPages(false)
          }
        }
      },
      [hasNextPage, data.length, searchParams.page, fetchNextPage, isFetchingPages],
    )

    const isLoadingData = isFetchingNextPage || isFetchingPages

    const handleVisibleColumnsChange = (columns: string[]) => {
      setSearchParams({ columns: columns.length === 0 ? null : columns })
    }

    const handleSelectedRowsChange = (rows: Set<string>) => {
      const rowArray = Array.from(rows)
      setSearchParams({ selectedRows: rowArray.length === 0 ? null : rowArray })
    }

    const handleDeleteClick = (row: UserData) => {
      setSelectedUser(row)
      onOpen()
    }

    const handleDeleteConfirm = () => {
      if (selectedUser && props.onDelete) {
        props.onDelete(selectedUser.id)
      }
      onClose()
    }

    return (
      <>
        <ManagementTable
          actions={[
            {
              text: "Edit",
              onClick: (row: UserData) => {
                console.log("Edit", row)
              },
            },
            {
              text: "Delete",
              onClick: handleDeleteClick,
            },
          ]}
          columns={columns}
          columnsConfig={COLUMNS_CONFIG}
          data={data}
          emptyStateColumnKey="name"
          emptyStateText="No users found."
          filterConfigs={FILTER_CONFIGS}
          paginationMetadata={paginationMetadata}
          paginationWithEdges={paginationWithEdges}
          providerProps={{
            totalItems: paginationMetadata.totalDocs,
            isLoading: isLoadingData,
            queryState: searchParams,
            onQueryStateChange: setSearchParams,
            onCurrentPageChange: handlePageChange,
            onPerPageChange: handlePerPageChange,
            onVisibleColumnsChange: handleVisibleColumnsChange,
            onSelectedRowsChange: handleSelectedRowsChange,
            allColumnKeys: ALL_COLUMN_KEYS,
          }}
          rowId="id"
        />

        <Dialog
          cancel="Cancel"
          header="Are you sure?"
          onCancel={onClose}
          onClose={onClose}
          onSuccess={handleDeleteConfirm}
          open={open}
          success={{
            children: "Delete",
            colorScheme: "danger",
          }}
        >
          You cannot undo this action.
        </Dialog>
      </>
    )
  },
)
