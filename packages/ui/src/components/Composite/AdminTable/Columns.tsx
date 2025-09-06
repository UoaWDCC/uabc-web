import type { PlayLevel } from "@repo/shared"
import { Text } from "@yamada-ui/react"
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
    css: {
      minW: "2xs",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
    css: {
      minW: "2xs",
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
    css: {
      minW: "3xs",
    },
  },
  {
    accessorKey: "level",
    header: "Play Level",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
    css: {
      minW: "2xs",
    },
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
    css: {
      minW: "2xs",
    },
  },
  {
    accessorKey: "university",
    header: "University",
    cell: ({ getValue }) => <>{getValue<string>()}</>,
    css: {
      minW: "2xs",
    },
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ getValue }) => <Text as="span">{getValue<string>()}</Text>,
    css: {
      minW: "xs",
    },
  },
]
