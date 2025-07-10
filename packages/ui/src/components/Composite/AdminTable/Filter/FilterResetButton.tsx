import { XIcon } from "@yamada-ui/lucide"
import { type FC, memo } from "react"
import { Button } from "../../../Primitive"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterResetButton: FC = memo(() => {
  const { hasFilter, clearFilter } = useMemberManagement()

  if (!hasFilter) return null

  return (
    <Button colorScheme="secondary" endIcon={<XIcon />} onClick={clearFilter}>
      Reset
    </Button>
  )
})

FilterResetButton.displayName = "FilterResetButton"
