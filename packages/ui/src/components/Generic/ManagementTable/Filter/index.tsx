"use client"

import { HStack, Spacer, VStack } from "@yamada-ui/react"
import type { MultiSelectProps } from "../../../Primitive/MultiSelect/MultiSelect"
import type { SelectProps } from "../../../Primitive/Select/Select"
import type { TextInputProps } from "../../../Primitive/TextInput/TextInput"
import type { ColumnConfig } from "../types"
import { FilterActions } from "./FilterActions"
import { FilterColumnVisibility } from "./FilterColumnVisibility"
import { FilterInput } from "./FilterInput"
import { FilterMultiSelect } from "./FilterMultiSelect"
import { FilterSelect } from "./FilterSelect"

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

function isTextConfig<TData>(config: FilterBarConfig<TData>): config is FilterTextConfig<TData> {
  return config.type === "text"
}
function isSelectConfig<TData>(
  config: FilterBarConfig<TData>,
): config is FilterSelectConfig<TData> {
  return config.type === "select"
}
function isMultiSelectConfig<TData>(
  config: FilterBarConfig<TData>,
): config is FilterMultiSelectConfig<TData> {
  return config.type === "multiselect"
}

export const Filter = <
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
>({
  filterConfigs,
  columnsConfig,
}: FilterProps<TData, TConfigs>) => {
  return (
    <VStack gap="md" w="full">
      {/* Main filter row */}
      <HStack gap="md" w="full">
        {filterConfigs.slice(0, 3).map((config) => {
          if (isTextConfig(config)) {
            const textConfig = config as FilterTextConfig<TData>
            return (
              <FilterInput<TData>
                filterKey={undefined}
                searchKeys={textConfig.key}
                {...textConfig}
                key={textConfig.key.join(",")}
              />
            )
          }
          if (isSelectConfig(config)) {
            return (
              <FilterSelect
                filterKey={config.key as unknown as never}
                {...config}
                key={config.key as string}
              />
            )
          }
          if (isMultiSelectConfig(config)) {
            return (
              <FilterMultiSelect
                filterKey={config.key as unknown as never}
                {...config}
                key={config.key as string}
              />
            )
          }
          return null
        })}
        <Spacer />
        <FilterColumnVisibility columns={columnsConfig} />
        <FilterActions />
      </HStack>
    </VStack>
  )
}

Filter.displayName = "Filter"
