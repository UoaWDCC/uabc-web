import type {
  CreateMemberPopUpFormValues,
  CreateUserRequest,
  Gender,
  MembershipType,
  PlayLevel,
  University,
} from "@repo/shared/types"
import { Button } from "@repo/ui/components/Primitive"
import { DownloadIcon, PlusIcon } from "@yamada-ui/lucide"
import { ButtonGroup, useDisclosure } from "@yamada-ui/react"
import { CreateMemberPopUp } from "../../CreateMemberPopUp"
import { useManagementTable } from "../MemberManagementContext"
import type { ColumnConfig } from "../types"
import { useFilterActions } from "./FilterActionsContext"
import { FilterColumnVisibility } from "./FilterColumnVisibility"

interface FilterActionsProps<TData> {
  columns: ColumnConfig<TData>[]
}

/**
 * Action buttons for the filter bar, including add and export actions.
 */
export const FilterActions = <TData,>({ columns }: FilterActionsProps<TData>) => {
  const { selectedRows, filteredData, totalItems } = useManagementTable()
  const { open: openCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()

  const { addMember } = useFilterActions()

  function handleAddConfirm(data: CreateMemberPopUpFormValues) {
    const createUserRequest: CreateUserRequest = {
      ...data,
      role: data.role as MembershipType,
      playLevel: data.playLevel as PlayLevel,
      gender: data.gender as Gender,
      university: data.university as University,
      image: null,
      emailVerification: {},
    }
    addMember(createUserRequest)
    onCloseCreate()
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
    return `Export ${totalItems} users`
  }

  return (
    <>
      <ButtonGroup alignItems="flex-end" gap="sm" order={{ base: 1, xl: 2 }}>
        <FilterColumnVisibility columns={columns} />
        <Button
          colorScheme="primary"
          minW="0"
          onClick={onOpenCreate}
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

      <CreateMemberPopUp
        onClose={onCloseCreate}
        onConfirm={(data) => handleAddConfirm(data)}
        open={openCreate}
      />
    </>
  )
}

FilterActions.displayName = "FilterActions"
