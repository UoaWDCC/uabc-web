import type { User } from "@repo/shared/payload-types"
import { Option, Select } from "@yamada-ui/react"
import type { FC } from "react"
import { memo } from "react"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterRoleSelect: FC = memo(() => {
  const { roleFilter, setRoleFilter } = useMemberManagement()

  const handleRoleChange = (value: string) => {
    setRoleFilter(value as User["role"] | "all")
  }

  return (
    <Select onChange={handleRoleChange} size="md" value={roleFilter} w="xs">
      <Option value="all">All Roles</Option>
      <Option value="admin">Admin</Option>
      <Option value="member">Member</Option>
      <Option value="casual">Casual</Option>
    </Select>
  )
})

FilterRoleSelect.displayName = "FilterRoleSelect"
