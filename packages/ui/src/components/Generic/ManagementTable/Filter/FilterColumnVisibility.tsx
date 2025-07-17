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
import { useManagementTable } from "../MemberManagementContext"
import type { ColumnConfig } from "../types"

export const FilterColumnVisibility = <TData,>({ columns }: { columns: ColumnConfig<TData>[] }) => {
  const { visibleColumns, toggleColumn } = useManagementTable()

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
            {columns.map((column) => (
              <Checkbox
                checked={visibleColumns.includes(column.key as string)}
                disabled={column.required}
                key={column.key as string}
                onChange={() => toggleColumn(column.key as string)}
              >
                {column.label}
              </Checkbox>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

FilterColumnVisibility.displayName = "FilterColumnVisibility"
