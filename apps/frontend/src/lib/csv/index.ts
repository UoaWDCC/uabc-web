/**
 * Properly escape a value for CSV format to prevent injection attacks
 * - Replace double quotes with two double quotes
 * - Wrap in quotes if contains comma, quote, newline
 *
 * @param value - The string value to escape
 * @returns The escaped string value
 */
export const escapeCsvValue = (value: string | number | null | undefined): string => {
  if (value == null) return ""

  // Escape double quotes by doubling them
  const escaped = String(value).replace(/"/g, '""')

  // Wrap in quotes if contains special characters
  if (escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")) {
    return `"${escaped}"`
  }

  return escaped
}

/**
 * Converts an array of rows into CSV content, handling escaping automatically.
 *
 * @param rows - Two-dimensional array representing rows and columns.
 * @returns A CSV-formatted string.
 */
export const buildCsv = (rows: Array<Array<string | number | null | undefined>>): string => {
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n")
}
