export type ColumnConfig<TData> = {
  key: keyof TData
  label: string
  required?: boolean
}
