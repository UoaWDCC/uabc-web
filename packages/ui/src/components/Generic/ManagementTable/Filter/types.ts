// types for FilterBarConfig, FilterTextConfig, FilterSelectConfig, FilterMultiSelectConfig, FieldFiltersFromConfig, FilterProps, FilterBarConfigType, and all Filter*Props from FilterInput, FilterSelect, FilterMultiSelect, and BaseFilterControl

import type { ReactNode } from "react"
import type { MultiSelectProps } from "../../../Primitive/MultiSelect/MultiSelect"
import type { SelectProps } from "../../../Primitive/Select/Select"
import type { TextInputProps } from "../../../Primitive/TextInput/TextInput"
import type { ColumnConfig } from "../types"

export type FilterBarConfigType = "text" | "select" | "multiselect"

export type FilterTextConfig<TData> = {
  type: "text"
  key: Array<keyof TData>
  label?: string
  placeholder?: string
} & Omit<
  TextInputProps,
  "value" | "onChange" | "defaultValue" | "ref" | "type" | "placeholder" | "label" | "key"
>

export type FilterSelectConfig<TData> = {
  type: "select"
  key: keyof TData
  label?: string
  items: { label: string; value: Lowercase<string> }[]
  onChange?: (value: string) => void
} & Omit<SelectProps, "items" | "onChange" | "value" | "defaultValue" | "ref" | "label" | "key">

export type FilterMultiSelectConfig<TData> = {
  type: "multiselect"
  key: keyof TData
  label?: string
  items: { label: string; value: Lowercase<string> }[]
  onChange?: (value: string[]) => void
} & Omit<
  MultiSelectProps,
  "items" | "onChange" | "value" | "defaultValue" | "ref" | "label" | "key"
>

export type FilterBarConfig<TData> =
  | FilterTextConfig<TData>
  | FilterSelectConfig<TData>
  | FilterMultiSelectConfig<TData>

export type FieldFiltersFromConfig<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = {
  [K in TConfigs[number] as K["key"] extends string
    ? K["key"]
    : never]: K["type"] extends "multiselect" ? string[] : string
}

export type FilterProps<TData, TConfigs extends readonly FilterBarConfig<TData>[]> = {
  filterConfigs: TConfigs
  columnsConfig: ColumnConfig<TData>[]
}

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

export type BaseFilterControlProps<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
  TValue = string | string[],
> = {
  filterKey: keyof FieldFiltersFromConfig<TData, TConfigs>
  value?: TValue
  onChange: (value: TValue) => void
  onClear: () => void
  children: (props: {
    value: TValue
    onChange: (value: TValue) => void
    onClear: () => void
  }) => ReactNode
}
