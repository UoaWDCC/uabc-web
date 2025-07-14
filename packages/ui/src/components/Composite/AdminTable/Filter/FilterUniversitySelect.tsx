import { Option } from "@yamada-ui/react"
import type { FC } from "react"
import { memo } from "react"
import { Select } from "../../../Primitive"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterUniversitySelect: FC = memo(() => {
  const { universityFilter, setUniversityFilter, availableUniversities } = useMemberManagement()

  const handleUniversityChange = (value: string) => {
    setUniversityFilter(value as typeof universityFilter)
  }

  return (
    <Select
      formControlProps={{
        w: "xs",
      }}
      onChange={handleUniversityChange}
      size="md"
      value={universityFilter || "all"}
    >
      {availableUniversities.map((university) => (
        <Option key={university || "all"} value={university || "all"}>
          {university === "all" ? "All Universities" : university || "Unknown"}
        </Option>
      ))}
    </Select>
  )
})

FilterUniversitySelect.displayName = "FilterUniversitySelect"
