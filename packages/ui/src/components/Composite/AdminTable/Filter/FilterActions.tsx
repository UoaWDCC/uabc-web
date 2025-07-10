import { DownloadIcon, PlusIcon } from "@yamada-ui/lucide"
import { ButtonGroup } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { Button } from "../../../Primitive"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterActions: FC = memo(() => {
  const { filteredMembers } = useMemberManagement()

  const handleAddMember = () => {
    // TODO: Implement add member functionality
    console.log("Add new member clicked")
  }

  const handleExportData = () => {
    // TODO: Implement export data functionality
    console.log(`Export ${filteredMembers.length} users clicked`)
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
        Export {filteredMembers.length} users
      </Button>
    </ButtonGroup>
  )
})

FilterActions.displayName = "FilterActions"
