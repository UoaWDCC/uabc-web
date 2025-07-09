import { type FC, memo } from "react"
import { TextInput } from "../../../Primitive"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterInput: FC = memo(() => {
  const { filterValue, setFilterValue } = useMemberManagement()

  return (
    <TextInput
      onChange={(ev) => {
        setFilterValue(ev.target.value)
      }}
      placeholder="Filter members..."
      value={filterValue}
      w="300px"
    />
  )
})

FilterInput.displayName = "FilterInput"
