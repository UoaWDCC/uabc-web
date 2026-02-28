import type { GameSessionSchedule } from "@repo/shared/types"
import { capitalize, formatTime } from "@repo/shared/utils"
import { Text } from "@yamada-ui/react"
import { type Column, createColumnHelper } from "@yamada-ui/table"

const columnHelper = createColumnHelper<GameSessionSchedule>()

export const columns: Column<GameSessionSchedule>[] = [
  {
    accessorKey: "name",
    header: "Session Name",
    cell: ({ getValue }) => <Text fontWeight="semibold">{getValue<string>()}</Text>,
  },
  columnHelper.accessor(
    (row) =>
      // Note that `row.day || ""` is used here because it causes a crash when there are no rows...
      `${capitalize(row.day || "")} ${formatTime(row.startTime)} - ${formatTime(row.endTime)}`,
    {
      id: "time",
      header: "Time",
      cell: ({ getValue }) => <Text color="muted">{getValue<string>()}</Text>,
    },
  ),
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ getValue }) => <Text color="muted">{getValue<number>()}</Text>,
  },
  {
    accessorKey: "casualCapacity",
    header: "Casual",
    cell: ({ getValue }) => <Text color="muted">{getValue<number>()}</Text>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ getValue }) => <Text color="muted">{getValue<string>()}</Text>,
  },
]
