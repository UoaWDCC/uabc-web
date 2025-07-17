import { MultiSelect, type MultiSelectProps } from "@repo/ui/components/Primitive"
import { useManagementTable } from "../MemberManagementContext"
import type { FieldFiltersFromConfig, FilterBarConfig } from "./index"

export type MultiSelectItem = { label: string; value: Lowercase<string> }

export type FilterMultiSelectProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
> = Omit<MultiSelectProps, "items" | "onChange"> & {
  items: MultiSelectItem[]
  onChange?: (value: string[]) => void
  filterKey: keyof FieldFiltersFromConfig<TData, TConfigs>
  filterConfigs?: TConfigs
}

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
  const value = Array.isArray(fieldFilters[filterKey]) ? fieldFilters[filterKey] : []

  const handleChange = (val: string[]) => {
    setFieldFilter(
      filterKey,
      val as unknown as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey],
    )
    onChange?.(val)
  }

  return (
    <MultiSelect items={items} onChange={handleChange} size="sm" value={value} w="xs" {...props} />
  )
}
