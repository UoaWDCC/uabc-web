import { Select } from "@repo/ui/components/Primitive"
import { useManagementTable } from "../MemberManagementContext"
import { BaseFilterControl } from "./BaseFilterControl"
import type {
  FieldFiltersFromConfig,
  FilterBarConfig,
  FilterSelectProps,
  SelectItem,
} from "./types"

/**
 * Select dropdown filter for ManagementTable. Supports clearing and custom items.
 */
export const FilterSelect = <
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
>({
  items,
  onChange,
  filterKey,
  label,
  filterConfigs,
  ...props
}: FilterSelectProps<TData, TConfigs>) => {
  const { fieldFilters, setFieldFilter, clearFieldFilter } = useManagementTable<TData, TConfigs>()
  const value = (fieldFilters[filterKey] as string) ?? "all"

  return (
    <BaseFilterControl<TData, TConfigs, string>
      filterKey={filterKey}
      onChange={(val: string) => {
        if (val === "all") {
          clearFieldFilter(filterKey)
        } else {
          setFieldFilter(
            filterKey,
            val as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey],
          )
        }
        onChange?.(val)
      }}
      onClear={() => clearFieldFilter(filterKey)}
      value={value}
    >
      {({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <Select
          aria-label={label}
          items={[{ label: "All", value: "all" as SelectItem["value"] }, ...items]}
          onChange={onChange}
          placeholder={label}
          size="sm"
          value={value}
          {...props}
        />
      )}
    </BaseFilterControl>
  )
}
