"use client"

import { EllipsisVerticalIcon } from "@yamada-ui/lucide"
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { memo, useMemo } from "react"
import { Filter, type FilterBarConfig } from "./Filter"
import type { ManagementTableProviderProps } from "./MemberManagementContext"
import { ManagementTableProvider } from "./MemberManagementContext"
import { PagingTable } from "./PagingTable"

export type ColumnConfig<TData> = {
  key: keyof TData
  label: string
  required?: boolean
}

export type ManagementTableProps<TData> = {
  data: TData[]
  columns: Column<TData>[]
  columnsConfig: ColumnConfig<TData>[]
  rowId: keyof TData
  actions?: Array<{ text: string; onClick: (row: TData) => void }>
  providerProps?: Partial<ManagementTableProviderProps<TData, readonly FilterBarConfig<TData>[]>>
  filterConfigs?: readonly FilterBarConfig<TData>[]
  searchInFields?: (keyof TData)[]
  emptyStateText: string
  emptyStateColumnKey: keyof TData
}

function createActionsColumn<TData>(
  actions: Array<{ text: string; onClick: (row: TData) => void }>,
): Column<TData> {
  const ActionsCell = memo<{ row: { original: TData } }>(({ row }) => {
    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
    }
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<EllipsisVerticalIcon />}
          onClick={handleMenuClick}
          size="sm"
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
  searchInFields,
  emptyStateText,
  emptyStateColumnKey,
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
      searchInFields={searchInFields}
      {...providerProps}
    >
      <Filter columnsConfig={columnsConfig} filterConfigs={filterConfigs} />
      <PagingTable
        columns={columnsWithActions}
        emptyStateColumnKey={emptyStateColumnKey}
        emptyStateText={emptyStateText}
        rowId={rowId}
      />
    </ManagementTableProvider>
  )
}
