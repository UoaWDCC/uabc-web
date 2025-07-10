import { Button } from "@repo/ui/components/Primitive"
import { DownloadIcon, PlusIcon } from "@yamada-ui/lucide"
import { ButtonGroup } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterActions: FC = memo(() => {
  const { selectedRows, filteredMembers } = useMemberManagement()

  const handleAddMember = () => {
    // TODO: Implement add member functionality
    console.log("Add new member clicked")
  }

  const handleExportData = () => {
    // TODO: Implement export data functionality
    const exportCount = selectedRows.size > 0 ? selectedRows.size : filteredMembers.length
    console.log(`Export ${exportCount} users clicked`)
  }

  const getExportText = () => {
    if (selectedRows.size > 0) {
      return `Export ${selectedRows.size} selected`
    }
    return `Export ${filteredMembers.length} users`
  }

  return (
    <ButtonGroup gap="sm">
      <Button colorScheme="primary" onClick={handleAddMember} size="sm" startIcon={<PlusIcon />}>
        Add Member
      </Button>
      <Button
        colorScheme="secondary"
        onClick={handleExportData}
        size="sm"
        startIcon={<DownloadIcon />}
      >
        {getExportText()}
      </Button>
    </ButtonGroup>
  )
})

FilterActions.displayName = "FilterActions"
