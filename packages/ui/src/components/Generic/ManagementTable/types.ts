export type ColumnConfig<TData> = {
  /**
   * The key of the column, corresponding to a property in the data.
   */
  key: keyof TData
  /**
   * The display label for the column.
   */
  label: string
  /**
   * Whether the column is required and cannot be hidden.
   */
  required?: boolean
}
