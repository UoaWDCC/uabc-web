import { Button } from "@repo/ui/components/Primitive"
import { DownloadIcon, PlusIcon } from "@yamada-ui/lucide"
import { ButtonGroup } from "@yamada-ui/react"
import { useManagementTable } from "../MemberManagementContext"
import type { ColumnConfig } from "../types"
import { FilterColumnVisibility } from "./FilterColumnVisibility"

interface FilterActionsProps<TData> {
  columns: ColumnConfig<TData>[]
}

/**
 * Action buttons for the filter bar, including add and export actions.
 */
export const FilterActions = <TData,>({ columns }: FilterActionsProps<TData>) => {
  const { selectedRows, filteredData } = useManagementTable()

  const handleAddMember = () => {
    // TODO: Implement add member functionality
    console.log("Add new member clicked")
  }

  const handleExportData = () => {
    // TODO: Implement export data functionality
    const exportCount = selectedRows.size > 0 ? selectedRows.size : filteredData.length
    console.log(`Export ${exportCount} users clicked`)
  }

  const getExportText = () => {
    if (selectedRows.size > 0) {
      return `Export ${selectedRows.size} selected`
    }
    return `Export ${filteredData.length} users`
  }

  return (
    <ButtonGroup alignItems="flex-end" gap="sm" order={{ base: 1, xl: 2 }}>
      <FilterColumnVisibility columns={columns} />
      <Button
        colorScheme="primary"
        minW="0"
        onClick={handleAddMember}
        px="md"
        size="sm"
        startIcon={<PlusIcon />}
      >
        Add
      </Button>
      <Button
        colorScheme="secondary"
        onClick={handleExportData}
        px="md"
        size="sm"
        startIcon={<DownloadIcon />}
      >
        {getExportText()}
      </Button>
    </ButtonGroup>
  )
}

FilterActions.displayName = "FilterActions"
