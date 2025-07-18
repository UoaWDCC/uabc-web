import { TextInput } from "@repo/ui/components/Primitive"
import { XIcon } from "@yamada-ui/lucide"
import { IconButton } from "@yamada-ui/react"
import { useManagementTable } from "../MemberManagementContext"
import { BaseFilterControl } from "./BaseFilterControl"
import type { FieldFiltersFromConfig, FilterBarConfig, FilterInputProps } from "./types"

/**
 * Text input filter for ManagementTable. Supports both field and multi-field search.
 */
export function FilterInput<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
>({ filterKey, label, placeholder, searchKeys }: FilterInputProps<TData, TConfigs>) {
  const {
    fieldFilters,
    setFieldFilter,
    clearFieldFilter,
    filterValue,
    setFilterValue,
    clearFilter,
  } = useManagementTable<TData, TConfigs>()
  const value = searchKeys
    ? filterValue
    : filterKey
      ? ((fieldFilters[filterKey] as string) ?? "")
      : ""

  return (
    <BaseFilterControl<TData, TConfigs, string>
      filterKey={filterKey as keyof FieldFiltersFromConfig<TData, TConfigs>}
      onChange={(val) => {
        if (searchKeys) {
          setFilterValue(val, Array.isArray(searchKeys) ? searchKeys : [searchKeys])
        } else if (filterKey) {
          setFieldFilter(
            filterKey,
            val as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey],
          )
        }
      }}
      onClear={() => {
        if (searchKeys) {
          clearFilter()
        } else if (filterKey) {
          clearFieldFilter(filterKey)
        }
      }}
      value={value}
    >
      {({ value, onChange, onClear }) => (
        <TextInput
          endElement={
            value && (
              <IconButton
                aria-label="Reset filter"
                colorScheme="secondary"
                icon={<XIcon />}
                onClick={onClear}
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
            minW: "200px",
          }}
          onChange={(ev) => onChange(ev.target.value)}
          placeholder={placeholder || label || "Filter..."}
          value={value}
        />
      )}
    </BaseFilterControl>
  )
}

FilterInput.displayName = "FilterInput"
