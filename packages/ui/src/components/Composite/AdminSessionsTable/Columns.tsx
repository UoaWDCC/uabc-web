import type { PlayLevel } from "@repo/shared"
import type { Column } from "@yamada-ui/table"

export type SessionData = {
  id: string
  name: string
  email: string
  sessions: string
  role: string
  level: PlayLevel
}

export const columns: Column<SessionData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "level",
    header: "Play Level",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "sessions",
    header: "Sessions",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
]
