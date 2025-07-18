import type { MultiSelectProps, SelectProps, TextInputProps } from "@repo/ui/components/Primitive"
import type { ReactNode } from "react"
import type { ColumnConfig } from "../types"

/**
 * Filter bar config type.
 */
export type FilterBarConfigType = "text" | "select" | "multiselect"

/**
 * Configuration for a text filter in the filter bar.
 */
export type FilterTextConfig<TData> = {
  /**
   * The type of filter (always 'text').
   */
  type: "text"
  /**
   * Keys to search in for this text filter.
   */
  key: Array<keyof TData>
  /**
   * Optional label for the filter input.
   */
  label?: string
  /**
   * Optional placeholder for the filter input.
   */
  placeholder?: string
} & Omit<
  TextInputProps,
  "value" | "onChange" | "defaultValue" | "ref" | "type" | "placeholder" | "label" | "key"
>

/**
 * Configuration for a select filter in the filter bar.
 */
export type FilterSelectConfig<TData> = {
  /**
   * The type of filter (always 'select').
   */
  type: "select"
  /**
   * Key to filter by.
   */
  key: keyof TData
  /**
   * Optional label for the select.
   */
  label?: string
  /**
   * Items to display in the select dropdown.
   */
  items: { label: string; value: Lowercase<string> }[]
  /**
   * Optional callback when the value changes.
   */
  onChange?: (value: string) => void
} & Omit<SelectProps, "items" | "onChange" | "value" | "defaultValue" | "ref" | "label" | "key">

/**
 * Configuration for a multiselect filter in the filter bar.
 */
export type FilterMultiSelectConfig<TData> = {
  /**
   * The type of filter (always 'multiselect').
   */
  type: "multiselect"
  /**
   * Key to filter by.
   */
  key: keyof TData
  /**
   * Optional label for the multiselect.
   */
  label?: string
  /**
   * Items to display in the multiselect dropdown.
   */
  items: { label: string; value: string }[]
  /**
   * Optional callback when the value changes.
   */
  onChange?: (value: string[]) => void
} & Omit<
  MultiSelectProps,
  "items" | "onChange" | "value" | "defaultValue" | "ref" | "label" | "key"
>

/**
 * Union of all filter bar config types.
 */
export type FilterBarConfig<TData> =
  | FilterTextConfig<TData>
  | FilterSelectConfig<TData>
  | FilterMultiSelectConfig<TData>

/**
 * Maps filter config to field filter value types.
 */
export type FieldFiltersFromConfig<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = {
  [K in TConfigs[number] as K["key"] extends string
    ? K["key"]
    : never]: K["type"] extends "multiselect" ? string[] : string
}

/**
 * Props for the Filter component.
 */
export type FilterProps<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = {
  /**
   * The filter configurations to render.
   */
  filterConfigs: TConfigs
  /**
   * The column configurations for the table.
   */
  columnsConfig: ColumnConfig<TData>[]
}

/**
 * Props for the FilterInput component.
 */
export type FilterInputProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
> = {
  /**
   * The key to filter by (for field-specific filtering).
   */
  filterKey?: keyof FieldFiltersFromConfig<TData, TConfigs>
  /**
   * Optional label for the input.
   */
  label?: string
  /**
   * Optional placeholder for the input.
   */
  placeholder?: string
  /**
   * The filter configurations (for context).
   */
  filterConfigs?: TConfigs
  /**
   * Keys to search in (for multi-field search).
   */
  searchKeys?: Array<keyof TData>
}

/**
 * Item for a multi-select filter.
 */
export type MultiSelectItem = {
  /**
   * The label to display for the item.
   */
  label: string
  /**
   * The value for the item (lowercase string).
   */
  value: Lowercase<string>
}

/**
 * Props for the FilterMultiSelect component.
 */
export type FilterMultiSelectProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
> = Omit<MultiSelectProps, "items" | "onChange"> & {
  /**
   * Items to display in the multiselect dropdown.
   */
  items: MultiSelectItem[]
  /**
   * Optional callback when the value changes.
   */
  onChange?: (value: string[]) => void
  /**
   * The key to filter by.
   */
  filterKey: keyof FieldFiltersFromConfig<TData, TConfigs>
  /**
   * The filter configurations (for context).
   */
  filterConfigs?: TConfigs
}

/**
 * Item for a select filter.
 */
export type SelectItem = {
  /**
   * The label to display for the item.
   */
  label: string
  /**
   * The value for the item (lowercase string).
   */
  value: Lowercase<string>
}

/**
 * Props for the FilterSelect component.
 */
export type FilterSelectProps<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = Omit<
  SelectProps,
  "items" | "onChange"
> & {
  /**
   * Items to display in the select dropdown.
   */
  items: SelectItem[]
  /**
   * Optional callback when the value changes.
   */
  onChange?: (value: string) => void
  /**
   * The key to filter by.
   */
  filterKey: keyof FieldFiltersFromConfig<TData, TConfigs>
  /**
   * Optional label for the select.
   */
  label?: string
  /**
   * The filter configurations (for context).
   */
  filterConfigs?: TConfigs
}

/**
 * Props for the BaseFilterControl component.
 */
export type BaseFilterControlProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
  TValue = string | string[],
> = {
  /**
   * The key to filter by.
   */
  filterKey: keyof FieldFiltersFromConfig<TData, TConfigs>
  /**
   * The current value of the filter.
   */
  value?: TValue
  /**
   * Callback when the value changes.
   */
  onChange: (value: TValue) => void
  /**
   * Callback to clear the filter value.
   */
  onClear: () => void
  /**
   * Render prop for the filter control UI.
   */
  children: (props: {
    value: TValue
    onChange: (value: TValue) => void
    onClear: () => void
  }) => ReactNode
}
