"use client"

import { EllipsisVerticalIcon } from "@yamada-ui/lucide"
import { Menu, MenuButton, MenuItem, MenuList } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { memo, useMemo } from "react"
import { IconButton } from "../../Primitive"
import { Filter, type FilterBarConfig } from "./Filter"
import type { ManagementTableProviderProps } from "./MemberManagementContext"
import { ManagementTableProvider } from "./MemberManagementContext"
import { PagingTable } from "./PagingTable"
import type { TableOptions } from "./Table"
import type { ColumnConfig } from "./types"

export type ManagementTableProps<TData> = {
  /**
   * The data to display in the table.
   */
  data: TData[]
  /**
   * The columns to display in the table.
   */
  columns: Column<TData>[]
  /**
   * The column configuration for the table.
   */
  columnsConfig: ColumnConfig<TData>[]
  /**
   * The key of the row ID property in the data.
   */
  rowId: keyof TData
  /**
   * Optional actions to display in the actions column.
   */
  actions?: Array<{ text: string; onClick: (row: TData) => void }>
  /**
   * Optional provider props for the ManagementTableProvider.
   */
  providerProps?: Partial<ManagementTableProviderProps<TData, readonly FilterBarConfig<TData>[]>>
  /**
   * Optional filter configurations for the filter bar.
   */
  filterConfigs?: readonly FilterBarConfig<TData>[]
  /**
   * The text to display when there is no data.
   */
  emptyStateText: string
  /**
   * The column key to use for the empty state cell.
   */
  emptyStateColumnKey: keyof TData
  /**
   * Whether to show the filter actions.
   */
  showFilterActions?: boolean
  /**
   * Optional props to pass to the table.
   */
  tableProps?: TableOptions
  /**
   * Optional pagination metadata to inform the pagination component.
   */
  paginationMetadata?: {
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  /**
   * If `true`, will show the first and last page buttons in pagination.
   *
   * @default true
   */
  paginationWithEdges?: boolean
}

function createActionsColumn<TData>(
  actions: Array<{ text: string; onClick: (row: TData) => void }>,
): Column<TData> {
  const ActionsCell = memo<{ row: { original: TData } }>(({ row }) => {
    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
    }
    return (
      <Menu lazy>
        <MenuButton
          aria-label="Actions"
          as={IconButton}
          icon={<EllipsisVerticalIcon />}
          onClick={handleMenuClick}
          size="xs"
          variant="ghost"
        />
        <MenuList onClick={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <MenuItem
              key={action.text}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick(row.original)
              }}
            >
              {action.text}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    )
  })
  ActionsCell.displayName = "ActionsCell"
  return {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell row={row} />,
    css: {
      textAlign: "center",
      maxW: "4",
      minW: "4",
      color: "transparent",
      userSelect: "none",
      overflow: "clip",
      px: "0",
      py: "0",
    },
  }
}

export function ManagementTable<TData>({
  data,
  columns,
  columnsConfig,
  rowId,
  actions,
  providerProps,
  filterConfigs = [],
  emptyStateText,
  emptyStateColumnKey,
  showFilterActions,
  tableProps,
  paginationMetadata,
  paginationWithEdges,
}: ManagementTableProps<TData>) {
  const allColumnKeys = useMemo(() => {
    let keys = columnsConfig.map((c) => c.key as keyof TData & string)
    if (actions && !keys.includes("actions" as keyof TData & string)) {
      keys = [...keys, "actions" as keyof TData & string]
    }
    return keys
  }, [columnsConfig, actions])

  const columnsWithActions = useMemo(() => {
    if (actions) {
      return [...columns, createActionsColumn<TData>(actions)]
    }
    return columns
  }, [columns, actions])

  return (
    <ManagementTableProvider<TData, readonly FilterBarConfig<TData>[]>
      allColumnKeys={allColumnKeys}
      data={data}
      filterConfigs={filterConfigs}
      isLoading={providerProps?.isLoading ?? false}
      rowId={rowId}
      {...providerProps}
    >
      <Filter
        columnsConfig={columnsConfig}
        filterConfigs={filterConfigs}
        showFilterActions={showFilterActions}
      />
      <PagingTable
        columns={columnsWithActions}
        emptyStateColumnKey={emptyStateColumnKey}
        emptyStateText={emptyStateText}
        paginationMetadata={paginationMetadata}
        paginationWithEdges={paginationWithEdges}
        rowId={rowId}
        tableProps={tableProps}
      />
    </ManagementTableProvider>
  )
}
