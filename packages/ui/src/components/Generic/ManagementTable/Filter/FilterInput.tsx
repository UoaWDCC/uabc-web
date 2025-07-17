import { XIcon } from "@yamada-ui/lucide"
import { IconButton } from "@yamada-ui/react"
import { TextInput } from "../../../Primitive"
import { useManagementTable } from "../MemberManagementContext"
import type { FieldFiltersFromConfig, FilterBarConfig } from "./index"

export type FilterInputProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
> = {
  filterKey?: keyof FieldFiltersFromConfig<TData, TConfigs>
  label?: string
  placeholder?: string
  filterConfigs?: TConfigs
  searchKeys?: Array<keyof TData>
}

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
    <TextInput
      endElement={
        value && (
          <IconButton
            aria-label="Reset filter"
            colorScheme="secondary"
            icon={<XIcon />}
            onClick={() => {
              if (searchKeys) {
                clearFilter()
              } else if (filterKey) {
                clearFieldFilter(filterKey)
              }
            }}
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
        if (searchKeys) {
          setFilterValue(ev.target.value, Array.isArray(searchKeys) ? searchKeys : [searchKeys])
        } else if (filterKey) {
          setFieldFilter(
            filterKey,
            ev.target.value as FieldFiltersFromConfig<TData, TConfigs>[typeof filterKey],
          )
        }
      }}
      placeholder={placeholder || label || "Filter..."}
      value={value}
    />
  )
}

FilterInput.displayName = "FilterInput"
