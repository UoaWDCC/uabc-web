import { XIcon } from "@yamada-ui/lucide"
import { Button } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterResetButton: FC = memo(() => {
  const { hasFilter, clearFilter } = useMemberManagement()

  if (!hasFilter) return null

  return (
    <Button endIcon={<XIcon />} onClick={clearFilter} variant="ghost">
      Reset
    </Button>
  )
})

FilterResetButton.displayName = "FilterResetButton"
