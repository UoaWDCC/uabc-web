import type { User } from "@repo/shared/payload-types"
import { Option } from "@yamada-ui/react"
import type { FC } from "react"
import { memo } from "react"
import { Select } from "../../../Primitive"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterRoleSelect: FC = memo(() => {
  const { roleFilter, setRoleFilter } = useMemberManagement()

  const handleRoleChange = (value: string) => {
    setRoleFilter(value as User["role"] | "all")
  }

  return (
    <Select
      formControlProps={{
        w: "xs",
      }}
      onChange={handleRoleChange}
      size="md"
      value={roleFilter}
    >
      <Option value="all">All Roles</Option>
      <Option value="admin">Admin</Option>
      <Option value="member">Member</Option>
      <Option value="casual">Casual</Option>
    </Select>
  )
})

FilterRoleSelect.displayName = "FilterRoleSelect"
