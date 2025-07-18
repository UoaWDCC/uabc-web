import type { PlayLevel } from "@repo/shared"
import type { Column } from "@yamada-ui/table"

export type UserData = {
  id: string
  name: string
  email: string
  remaining: string
  joined: string
  role: string
  university: string
  level: PlayLevel
}

export const columns: Column<UserData>[] = [
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
    accessorKey: "remaining",
    header: "Remaining",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "university",
    header: "University",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
  },
]
