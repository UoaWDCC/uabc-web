import type { SelectItem } from "@yamada-ui/react"

/**
 * Recursively retrieves the display label(s) for a given value or array of values from a list of select items,
 * supporting grouped options (items with nested items).
 *
 * @param items The select items, which may include grouped items with nested items.
 * @param value The value or array of values to find display labels for.
 * @returns The display label(s) as a string, joined by comma if multiple.
 */
export function getDisplayValue(items: SelectItem[], value: string | string[]): string {
  if (Array.isArray(value)) {
    const labels: string[] = []
    for (const v of value) {
      const label = getDisplayValue(items, v)
      if (label) {
        labels.push(label)
      }
    }
    return labels.join(", ")
  }

  for (const item of items) {
    if ("items" in item && Array.isArray(item.items)) {
      const label = getDisplayValue(item.items, value)
      if (label) {
        return label
      }
    } else if ((item as { value: string }).value === value) {
      return item.label as string
    }
  }

  return ""
}
