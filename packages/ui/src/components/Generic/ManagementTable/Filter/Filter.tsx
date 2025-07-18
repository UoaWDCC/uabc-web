"use client"

import { HStack, Stack, VStack, Wrap } from "@yamada-ui/react"
import { FilterActions } from "./FilterActions"
import { FilterColumnVisibility } from "./FilterColumnVisibility"
import { FilterInput } from "./FilterInput"
import { FilterMultiSelect } from "./FilterMultiSelect"
import { FilterSelect } from "./FilterSelect"
import type {
  FilterBarConfig,
  FilterMultiSelectConfig,
  FilterProps,
  FilterSelectConfig,
  FilterTextConfig,
} from "./types"

/**
 * Checks if a filter config is a text filter.
 */
function isTextConfig<TData>(config: FilterBarConfig<TData>): config is FilterTextConfig<TData> {
  return config.type === "text"
}
/**
 * Checks if a filter config is a select filter.
 */
function isSelectConfig<TData>(
  config: FilterBarConfig<TData>,
): config is FilterSelectConfig<TData> {
  return config.type === "select"
}
/**
 * Checks if a filter config is a multiselect filter.
 */
function isMultiSelectConfig<TData>(
  config: FilterBarConfig<TData>,
): config is FilterMultiSelectConfig<TData> {
  return config.type === "multiselect"
}

/**
 * Renders the filter bar with up to three filter controls and actions.
 */
export const Filter = <
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
>({
  filterConfigs,
  columnsConfig,
}: FilterProps<TData, TConfigs>) => {
  return (
    <VStack gap="md" w="full">
      <Stack flexDirection={{ base: "column", xl: "row" }} gap="md" w="full">
        <Wrap gap="md" minW={0} order={{ base: 2, xl: 1 }} w="full">
          {filterConfigs.map((config) => {
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
        </Wrap>
        <HStack alignItems={{ base: "start", xl: "center" }} order={{ base: 1, xl: 2 }}>
          <FilterColumnVisibility columns={columnsConfig} />
          <FilterActions />
        </HStack>
      </Stack>
    </VStack>
  )
}

Filter.displayName = "Filter"
