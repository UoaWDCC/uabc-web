import { Text } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"

export type SemesterSessionRow = {
  id: string
  sessionName: string
  time: string
  sessionType: string
}

export const columns: Column<SemesterSessionRow>[] = [
  {
    accessorKey: "sessionName",
    header: "Session Name",
    cell: ({ getValue }) => <Text fontWeight="semibold">{getValue<string>()}</Text>,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ getValue }) => <Text color="muted">{getValue<string>()}</Text>,
  },
  {
    accessorKey: "sessionType",
    header: "Session Type",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
]
