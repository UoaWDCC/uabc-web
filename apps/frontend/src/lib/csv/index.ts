/**
 * Properly escape a value for CSV format to prevent injection attacks
 * - Replace double quotes with two double quotes
 * - Wrap in quotes if contains comma, quote, newline
 *
 * @param value The value to escape (string, number, null, or undefined)
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
 * @param rows Two-dimensional array representing rows and columns.
 * @returns A CSV-formatted string.
 */
export const buildCsv = (rows: Array<Array<string | number | null | undefined>>): string => {
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n")
}

/**
 * Build CSV content from an array of objects.
 * Dynamically extracts all available fields from the objects as headers.
 *
 * @param records Array of objects to convert to CSV
 * @returns CSV-formatted string with headers derived from object keys
 */
export const buildCsvFromRecords = <T extends Record<string, string | number | null | undefined>>(
  records: T[],
): string => {
  if (!records || records.length === 0) return ""

  // Extract all unique keys from all records
  const allKeys = new Set<string>()
  for (const record of records) {
    for (const key of Object.keys(record)) {
      allKeys.add(key)
    }
  }

  const headers = Array.from(allKeys)

  const rows: Array<Array<string | number | null | undefined>> = [
    headers,
    ...records.map((record) => headers.map((key) => record[key])),
  ]

  return buildCsv(rows)
}
