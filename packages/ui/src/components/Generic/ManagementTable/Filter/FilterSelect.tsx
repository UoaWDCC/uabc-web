import { Select, type SelectProps } from "@repo/ui/components/Primitive"
import { useManagementTable } from "../MemberManagementContext"
import type { FieldFiltersFromConfig, FilterBarConfig } from "./index"

export type SelectItem = { label: string; value: Lowercase<string> }

export type FilterSelectProps<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = Omit<
  SelectProps,
  "items" | "onChange"
> & {
  items: SelectItem[]
  onChange?: (value: string) => void
  filterKey: keyof FieldFiltersFromConfig<TData, TConfigs>
  label?: string
  filterConfigs?: TConfigs
}

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
  // Use the strictly typed context
  const { fieldFilters, setFieldFilter, clearFieldFilter } = useManagementTable<TData, TConfigs>()

  const handleChange = (value: string) => {
    if (value === "all") {
      clearFieldFilter(filterKey)
    } else {
      setFieldFilter(filterKey, value as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey])
    }
    onChange?.(value)
  }

  return (
    <Select
      aria-label={label}
      items={[{ label: "All", value: "all" as unknown as SelectItem["value"] }, ...items]}
      onChange={handleChange}
      size="sm"
      value={(fieldFilters[filterKey] as string) ?? "all"}
      w="xs"
      {...props}
    />
  )
}
