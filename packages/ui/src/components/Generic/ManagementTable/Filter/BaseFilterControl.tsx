import type { BaseFilterControlProps, FilterBarConfig } from "./types"

/**
 * Base component for filter controls. Handles value, change, and clear logic for filter UI.
 */
export function BaseFilterControl<
  TData,
  TConfigs extends readonly FilterBarConfig<TData>[] = FilterBarConfig<TData>[],
  TValue = string | string[],
>(props: BaseFilterControlProps<TData, TConfigs, TValue>) {
  const { value, onChange, onClear, children } = props
  return <>{children({ value: value as TValue, onChange, onClear })}</>
}
