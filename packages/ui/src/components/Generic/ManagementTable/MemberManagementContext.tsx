"use client"

import { parseAsArrayOf, parseAsInteger, parseAsJson, parseAsString, useQueryStates } from "nuqs"
import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { FieldFiltersFromConfig, FilterBarConfig } from "./Filter"

/**
 * State and actions for the management table context.
 */
export type ManagementTableState<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = {
  // Data
  data: TData[]
  filteredData: TData[]
  paginatedData: TData[]
  isLoading: boolean

  // Filter state
  filterValue: string
  setFilterValue: (value: string, searchKeys?: (keyof TData)[]) => void
  hasFilter: boolean
  clearFilter: () => void
  clearAllFilters: () => void

  // Field/group filters
  fieldFilters: FieldFiltersFromConfig<TData, TConfigs>
  setFieldFilter: <K extends keyof FieldFiltersFromConfig<TData, TConfigs>>(
    key: K,
    value: FieldFiltersFromConfig<TData, TConfigs>[K],
  ) => void
  clearFieldFilter: (key: keyof FieldFiltersFromConfig<TData, TConfigs>) => void

  // Column visibility state
  visibleColumns: string[]
  setVisibleColumns: (columns: string[]) => void
  toggleColumn: (column: string) => void

  // Row selection state
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
  toggleRowSelection: (rowId: string) => void
  selectAllRows: () => void
  clearSelection: () => void
  isRowSelected: (rowId: string) => boolean
  isAllSelected: boolean
  isIndeterminate: boolean
  selectedData: TData[]

  // Search and filtering
  searchInFields: (keyof TData)[]
  setSearchFields: (fields: (keyof TData)[]) => void

  // Pagination state
  currentPage: number
  setCurrentPage: (page: number) => void
  perPage: number
  setPerPage: (perPage: number) => void
  totalPages: number
  totalItems: number

  // UI State
  isSelectionMode: boolean
  setSelectionMode: (enabled: boolean) => void
}

/**
 * Props for ManagementTableProvider.
 */
export type ManagementTableProviderProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[],
> = {
  children: ReactNode
  data: TData[]
  isLoading: boolean
  rowId: keyof TData
  allColumnKeys: (keyof TData & string)[]
  filterConfigs: TConfigs
  queryState?: {
    filter: string
    columns: string[]
    selectedRows: string[]
    page: number
    perPage: number
    fieldFilters: FieldFiltersFromConfig<TData, TConfigs>
  }
  onQueryStateChange?: (
    updates: Partial<{
      filter: string | null
      columns: string[] | null
      selectedRows: string[] | null
      page: number | null
      perPage: number | null
      fieldFilters: FieldFiltersFromConfig<TData, TConfigs> | null
    }>,
  ) => void
  onFilterChange?: (filterValue: string) => void
  onVisibleColumnsChange?: (columns: string[]) => void
  onSelectedRowsChange?: (rows: Set<string>) => void
  onClearSelection?: () => void
  onToggleRowSelection?: (rowId: string) => void
  onCurrentPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  totalItems?: number
}

const ManagementTableContext = createContext<unknown>(null)

/**
 * Provides management table state and actions to children.
 */
export const ManagementTableProvider = <
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
>({
  children,
  data,
  isLoading,
  rowId,
  queryState,
  onQueryStateChange,
  onFilterChange,
  onVisibleColumnsChange,
  onSelectedRowsChange,
  onClearSelection,
  onToggleRowSelection,
  onCurrentPageChange,
  onPerPageChange,
  totalItems,
  allColumnKeys,
}: ManagementTableProviderProps<TData, TConfigs>) => {
  const canUseParentQueryState = !!queryState && !!onQueryStateChange

  const [internalSearchParams, setInternalSearchParams] = useQueryStates(
    {
      filter: parseAsString.withDefault(""),
      columns: parseAsArrayOf(parseAsString).withDefault(allColumnKeys),
      selectedRows: parseAsArrayOf(parseAsString).withDefault([]),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(20),
      fieldFilters: parseAsJson<FieldFiltersFromConfig<TData, TConfigs>>(
        (value) => value as FieldFiltersFromConfig<TData, TConfigs>,
      ).withDefault({} as FieldFiltersFromConfig<TData, TConfigs>),
    },
    {
      clearOnDefault: true,
    },
  )

  const searchParams = canUseParentQueryState ? queryState : internalSearchParams
  const setSearchParams = canUseParentQueryState ? onQueryStateChange : setInternalSearchParams

  const {
    filter: filterValue,
    columns: rawVisibleColumns,
    selectedRows: selectedRowIds,
    page: currentPage,
    perPage,
    fieldFilters,
  } = searchParams

  const [isSelectionMode, setSelectionMode] = useState(false)

  const [searchInFields, setSearchFields] = useState<(keyof TData)[]>([])

  const visibleColumns = useMemo(() => {
    return rawVisibleColumns &&
      rawVisibleColumns.length > 0 &&
      rawVisibleColumns.length < allColumnKeys.length
      ? rawVisibleColumns
      : allColumnKeys
  }, [rawVisibleColumns, allColumnKeys])

  const members = useMemo(() => (Array.isArray(data) ? data : []), [data])

  const selectedRows = useMemo(() => {
    return new Set(selectedRowIds)
  }, [selectedRowIds])

  const toKebabCase = useCallback((str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }, [])

  const filteredData = useMemo(() => {
    let filtered = members
    if (!canUseParentQueryState && filterValue) {
      const kebabFilter = toKebabCase(filterValue)
      filtered = filtered.filter((member) => {
        return searchInFields.some((field) => {
          const value = member[field]
          if (value === null || value === undefined) return false
          return toKebabCase(String(value)).includes(kebabFilter)
        })
      })
    }
    // Apply field/group filters
    if (fieldFilters && typeof fieldFilters === "object" && !Array.isArray(fieldFilters)) {
      Object.entries(fieldFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            filtered = filtered.filter((member) => {
              const memberValue = member[key as keyof TData]
              return value.some(
                (filterVal) => toKebabCase(String(memberValue)) === toKebabCase(String(filterVal)),
              )
            })
          }
        } else if (value) {
          filtered = filtered.filter((member) => {
            const fieldValue = member[key as keyof TData]
            return toKebabCase(String(fieldValue)) === toKebabCase(String(value))
          })
        }
      })
    }
    return Array.isArray(filtered) ? filtered : []
  }, [members, filterValue, searchInFields, fieldFilters, toKebabCase, canUseParentQueryState])

  const totalPages = useMemo(() => {
    if (canUseParentQueryState && totalItems !== undefined) {
      return Math.ceil(totalItems / perPage)
    }
    return Math.ceil(filteredData.length / perPage)
  }, [filteredData.length, perPage, canUseParentQueryState, totalItems])

  const paginatedData = useMemo(() => {
    if (!Array.isArray(filteredData)) return []
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, perPage])

  const isAllSelected = useMemo(() => {
    if (!Array.isArray(paginatedData) || paginatedData.length === 0) return false
    return paginatedData.every((member) => selectedRows.has(String(member[rowId])))
  }, [paginatedData, selectedRows, rowId])

  const isIndeterminate = useMemo(() => {
    if (!Array.isArray(paginatedData) || paginatedData.length === 0) return false
    const selectedCount = paginatedData.filter((member) =>
      selectedRows.has(String(member[rowId])),
    ).length
    return selectedCount > 0 && selectedCount < paginatedData.length
  }, [paginatedData, selectedRows, rowId])

  const setFilterValue = useCallback(
    (value: string, searchKeys?: (keyof TData)[]) => {
      if (searchKeys && searchKeys.length > 0) {
        setSearchFields(searchKeys)
      }
      setSearchParams({
        filter: value || null,
        page: 1,
      })
      if (onFilterChange) {
        onFilterChange(value)
      }
    },
    [setSearchParams, onFilterChange],
  )

  const clearFilter = useCallback(() => {
    setSearchParams({
      filter: null,
      page: 1,
    })
    if (onFilterChange) {
      onFilterChange("")
    }
  }, [setSearchParams, onFilterChange])

  const setVisibleColumns = useCallback(
    (columns: string[]) => {
      setSearchParams({
        columns: columns.length === allColumnKeys.length ? null : columns,
      })
      if (onVisibleColumnsChange) {
        onVisibleColumnsChange(columns)
      }
    },
    [setSearchParams, allColumnKeys.length, onVisibleColumnsChange],
  )

  const toggleColumn = useCallback(
    (column: string) => {
      const newColumns = visibleColumns.includes(column)
        ? visibleColumns.filter((col) => col !== column)
        : [...visibleColumns, column]
      setVisibleColumns(newColumns)
      if (onVisibleColumnsChange) {
        onVisibleColumnsChange(newColumns)
      }
    },
    [visibleColumns, setVisibleColumns, onVisibleColumnsChange],
  )

  const setSelectedRows = useCallback(
    (rows: Set<string>) => {
      const rowArray = Array.from(rows)
      setSearchParams({
        selectedRows: rowArray.length === 0 ? null : rowArray,
      })
      if (onSelectedRowsChange) {
        onSelectedRowsChange(rows)
      }
    },
    [setSearchParams, onSelectedRowsChange],
  )

  const toggleRowSelection = useCallback(
    (rowId: string) => {
      const newSelection = new Set(selectedRows)
      if (newSelection.has(rowId)) {
        newSelection.delete(rowId)
      } else {
        newSelection.add(rowId)
      }
      setSelectedRows(newSelection)
      if (onToggleRowSelection) {
        onToggleRowSelection(rowId)
      }
    },
    [selectedRows, setSelectedRows, onToggleRowSelection],
  )

  const selectAllRows = useCallback(() => {
    const newSelection = new Set(selectedRows)
    for (const member of paginatedData) {
      newSelection.add(String(member[rowId]))
    }
    setSelectedRows(newSelection)
  }, [selectedRows, paginatedData, setSelectedRows, rowId])

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
    if (onClearSelection) {
      onClearSelection()
    }
  }, [setSelectedRows, onClearSelection])

  const isRowSelected = useCallback(
    (rowId: string) => {
      return selectedRows.has(rowId)
    },
    [selectedRows],
  )

  const setCurrentPage = useCallback(
    (page: number) => {
      setSearchParams({ page: page === 1 ? null : page })
      if (onCurrentPageChange) {
        onCurrentPageChange(page)
      }
    },
    [setSearchParams, onCurrentPageChange],
  )

  const setPerPage = useCallback(
    (newPerPage: number) => {
      setSearchParams({
        perPage: newPerPage === 20 ? null : newPerPage,
        page: 1,
      })
      if (onPerPageChange) {
        onPerPageChange(newPerPage)
      }
    },
    [setSearchParams, onPerPageChange],
  )

  const hasFilter = useMemo(() => {
    const hasFieldFilters = fieldFilters && Object.keys(fieldFilters).length > 0
    return (
      !!filterValue ||
      visibleColumns.length < allColumnKeys.length ||
      selectedRows.size > 0 ||
      hasFieldFilters
    )
  }, [filterValue, visibleColumns.length, allColumnKeys.length, selectedRows.size, fieldFilters])

  const selectedData = useMemo(() => {
    return data.filter((row) => selectedRows.has(String(row[rowId])))
  }, [data, selectedRows, rowId])

  const setFieldFilter = useCallback(
    <K extends keyof FieldFiltersFromConfig<TData, TConfigs>>(
      key: K,
      value: FieldFiltersFromConfig<TData, TConfigs>[K],
    ) => {
      const currentFilters = fieldFilters || ({} as FieldFiltersFromConfig<TData, TConfigs>)
      const newFilters = { ...currentFilters, [key]: value }
      setSearchParams({
        fieldFilters: Object.keys(newFilters).length > 0 ? newFilters : null,
        page: 1, // Reset to first page when filter changes
      })
    },
    [fieldFilters, setSearchParams],
  )

  const clearFieldFilter = useCallback(
    (key: keyof FieldFiltersFromConfig<TData, TConfigs>) => {
      const currentFilters = fieldFilters || ({} as FieldFiltersFromConfig<TData, TConfigs>)
      const newFilters = { ...currentFilters }
      delete newFilters[key]
      setSearchParams({
        fieldFilters: Object.keys(newFilters).length > 0 ? newFilters : null,
        page: 1, // Reset to first page when filter changes
      })
    },
    [fieldFilters, setSearchParams],
  )

  const value: ManagementTableState<TData, TConfigs> = {
    // Data
    data,
    filteredData,
    paginatedData,
    isLoading,

    // Filter state
    filterValue,
    setFilterValue,
    hasFilter,
    clearFilter,
    clearAllFilters: clearFilter, // for API compatibility, but points to clearFilter

    // Field/group filters
    fieldFilters: fieldFilters || ({} as FieldFiltersFromConfig<TData, TConfigs>),
    setFieldFilter,
    clearFieldFilter,

    // Column visibility state
    visibleColumns,
    setVisibleColumns,
    toggleColumn,

    // Row selection state
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    selectedData,

    // Search and filtering
    searchInFields,
    setSearchFields,

    // Pagination state
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPages,
    totalItems: totalItems ?? 0,

    // UI State
    isSelectionMode,
    setSelectionMode,
  }

  return <ManagementTableContext.Provider value={value}>{children}</ManagementTableContext.Provider>
}

/**
 * Hook to access the management table context.
 */
export function useManagementTable<TData, TConfigs extends readonly FilterBarConfig<TData>[]>() {
  const context = useContext(ManagementTableContext) as ManagementTableState<TData, TConfigs> | null
  if (!context) {
    throw new Error("useManagementTable must be used within a ManagementTableProvider")
  }
  return context
}
