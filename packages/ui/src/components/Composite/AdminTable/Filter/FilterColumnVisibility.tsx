import { FilterIcon } from "@yamada-ui/lucide"
import {
  Checkbox,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"
import { memo } from "react"
import { AVAILABLE_COLUMNS, useMemberManagement } from "../MemberManagementContext"

export const FilterColumnVisibility: FC = memo(() => {
  const { visibleColumns, toggleColumn } = useMemberManagement()

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label="Toggle column visibility" icon={<FilterIcon />} size="sm" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <VStack gap="sm">
            <Text fontSize="sm" fontWeight="semibold">
              Column Visibility
            </Text>
            {AVAILABLE_COLUMNS.map((column) => (
              <Checkbox
                checked={visibleColumns.includes(column.key)}
                disabled={column.required}
                key={column.key}
                onChange={() => toggleColumn(column.key)}
              >
                {column.label}
              </Checkbox>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
})

FilterColumnVisibility.displayName = "FilterColumnVisibility"
