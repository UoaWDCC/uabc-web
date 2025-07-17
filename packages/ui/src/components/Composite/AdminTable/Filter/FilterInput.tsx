import { XIcon } from "@yamada-ui/lucide"
import { IconButton, useWindowEvent } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { TextInput } from "../../../Primitive"
import { useMemberManagement } from "../MemberManagementContext"

export const FilterInput: FC = memo(() => {
  const { filterValue, setFilterValue, clearFilter } = useMemberManagement()

  useWindowEvent("keydown", (ev) => {
    if (ev.key === "Escape") {
      clearFilter()
    }
  })

  return (
    <TextInput
      endElement={
        filterValue && (
          <IconButton
            aria-label="Reset filter"
            colorScheme="secondary"
            icon={<XIcon />}
            onClick={clearFilter}
            rounded="md"
            size="xs"
          />
        )
      }
      endElementProps={{
        clickable: true,
      }}
      inputGroupProps={{
        w: "300px",
      }}
      onChange={(ev) => {
        setFilterValue(ev.target.value)
      }}
      placeholder="Filter members..."
      value={filterValue}
    />
  )
})

FilterInput.displayName = "FilterInput"
