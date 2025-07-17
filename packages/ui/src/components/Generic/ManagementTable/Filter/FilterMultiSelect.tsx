import { MultiSelect } from "@repo/ui/components/Primitive"
import { useManagementTable } from "../MemberManagementContext"
import { BaseFilterControl } from "./BaseFilterControl"
import type { FieldFiltersFromConfig, FilterBarConfig, FilterMultiSelectProps } from "./types"

/**
 * Multi-select dropdown filter for ManagementTable. Allows selecting multiple values.
 */
export const FilterMultiSelect = <
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
>({
  items,
  onChange,
  filterKey,
  filterConfigs,
  ...props
}: FilterMultiSelectProps<TData, TConfigs>) => {
  const { fieldFilters, setFieldFilter } = useManagementTable<TData, TConfigs>()
  const value = Array.isArray(fieldFilters[filterKey]) ? (fieldFilters[filterKey] as string[]) : []

  return (
    <BaseFilterControl<TData, TConfigs, string[]>
      filterKey={filterKey}
      onChange={(val: string[]) => {
        setFieldFilter(filterKey, val as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey])
        onChange?.(val)
      }}
      onClear={() =>
        setFieldFilter(filterKey, [] as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey])
      }
      value={value}
    >
      {({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) => (
        <MultiSelect
          items={items}
          minW="md"
          onChange={onChange}
          size="sm"
          value={value}
          {...props}
        />
      )}
    </BaseFilterControl>
  )
}
