"use client"

import type { User } from "@repo/shared/payload-types"
import type {
  CreateMemberPopUpFormValues,
  Gender,
  MembershipType,
  PaginationQuery,
  PlayLevel,
  University,
  UpdateUserRequest,
} from "@repo/shared/types"
import { ManagementTable } from "@repo/ui/components/Generic"
import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Dialog, useDisclosure } from "@yamada-ui/react"
import dayjs from "dayjs"
import { parseAsArrayOf, parseAsInteger, parseAsJson, parseAsString, useQueryStates } from "nuqs"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import type { FieldFiltersFromConfig } from "../../Generic/ManagementTable/Filter"
import { CreateMemberPopUp } from "../../Generic/CreateMemberPopUp"
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
  onEdit?: (id: string, data: UpdateUserRequest) => void
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
    onEdit,
    onDelete,
  }: AdminTableWithPaginatedDataProps) => {
    const { open: openEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const { open: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
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
      const currentUserDataCount =
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
        currenUserDataCount: currentUserDataCount,
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
            
    const handleEditClick = (row: UserData) => {
      const currentUsers = queriedData?.pages.flatMap((page) => page.data?.docs || []) || []
      const user = currentUsers.find((user) => user.id === row.id)
      if (user) {
        setSelectedUser(user)
        onOpenEdit()
      }
    }

    const handleEditConfirm = (data: CreateMemberPopUpFormValues) => {
      if (selectedUser && onEdit) {
        const updateUserRequest: UpdateUserRequest = {
          ...data,
          role: data.role as MembershipType,
          playLevel: data.playLevel as PlayLevel,
          gender: data.gender as Gender,
          university: data.university as University,
        }
        onEdit(selectedUser.id, updateUserRequest)
      }
      onCloseEdit()
    }

    const handleDeleteClick = (row: UserData) => {
      const currentUsers = queriedData?.pages.flatMap((page) => page.data?.docs || []) || []
      const user = currentUsers.find((user) => user.id === row.id)
      if (user) {
        setSelectedUser(user)
        onOpenDelete()
      }
    }

    const handleDeleteConfirm = () => {
      if (selectedUser && onDelete) {
        onDelete(selectedUser.id)
      }
      onCloseDelete()
    }

    return (
      <>
        <ManagementTable
          actions={[
            {
              text: "Edit",
              onClick: handleEditClick,
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

        <CreateMemberPopUp
          key={selectedUser?.id}
          onClose={() => {
            setSelectedUser(null)
            onCloseEdit()
          }}
          onConfirm={(data) => handleEditConfirm(data)}
          open={openEdit}
          title="Edit Member"
          userToEdit={selectedUser}
        />

        <Dialog
          cancel="Cancel"
          header="Are you sure?"
          onCancel={onCloseDelete}
          onClose={() => {
            setSelectedUser(null)
            onCloseDelete()
          }}
          onSuccess={handleDeleteConfirm}
          open={openDelete}
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
