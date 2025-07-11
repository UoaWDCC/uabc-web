import type { User } from "@repo/shared/payload-types"
import { EllipsisVerticalIcon } from "@yamada-ui/lucide"
import { Badge, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { memo } from "react"

const NameCell = memo(({ user }: { user: User }) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
  return (
    <Text as="span" lineClamp={1}>
      {fullName}
    </Text>
  )
})

NameCell.displayName = "NameCell"

export const NAME_COLUMN: Column<User> = {
  accessorKey: "firstName",
  header: "Name",
  cell: ({ row }) => {
    return <NameCell user={row.original} />
  },
}

const EmailCell = memo(({ value }: { value: string }) => (
  <Text as="span" lineClamp={1}>
    {value}
  </Text>
))

EmailCell.displayName = "EmailCell"

export const EMAIL_COLUMN: Column<User> = {
  accessorKey: "email",
  header: "Email",
  cell: ({ getValue }) => {
    const value = getValue() as string
    return <EmailCell value={value} />
  },
}

const RoleCell = memo(({ value }: { value: User["role"] }) => {
  const colorScheme = {
    admin: "red",
    member: "blue",
    casual: "green",
  } as const

  return (
    <Badge colorScheme={colorScheme[value]} variant="subtle">
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </Badge>
  )
})

RoleCell.displayName = "RoleCell"

export const ROLE_COLUMN: Column<User> = {
  accessorKey: "role",
  header: "Role",
  css: { w: "120px", textAlign: "center" },
  cell: ({ getValue }) => {
    const value = getValue() as User["role"]
    return <RoleCell value={value} />
  },
}

const SessionsCell = memo(({ value }: { value: number | null }) => (
  <Text as="span" display="block" textAlign="center">
    {value ?? "N/A"}
  </Text>
))

SessionsCell.displayName = "SessionsCell"

export const REMAINING_SESSIONS_COLUMN: Column<User> = {
  accessorKey: "remainingSessions",
  header: "Remaining",
  css: { w: "150px", textAlign: "center" },
  cell: ({ getValue }) => {
    const value = getValue() as number | null
    return <SessionsCell value={value} />
  },
}

const UniversityCell = memo(({ value }: { value: User["university"] }) => (
  <Text as="span" lineClamp={1}>
    {value ?? "N/A"}
  </Text>
))

UniversityCell.displayName = "UniversityCell"

export const UNIVERSITY_COLUMN: Column<User> = {
  accessorKey: "university",
  header: "University",
  css: { w: "150px" },
  cell: ({ getValue }) => {
    const value = getValue() as User["university"]
    return <UniversityCell value={value} />
  },
}

const ActionsCell = memo(() => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log("Action")
  }

  const handleOnEdit = (_e: React.MouseEvent<HTMLElement>) => {
    // e.stopPropagation()
    console.log("Edit")
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<EllipsisVerticalIcon />}
        onClick={handleOnClick}
        size="sm"
        variant="ghost"
      />
      <MenuList onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={handleOnEdit}>Edit</MenuItem>
      </MenuList>
    </Menu>
  )
})

ActionsCell.displayName = "ActionsCell"

export const ACTIONS_COLUMN: Column<User> = {
  id: "actions",
  header: "",
  css: {
    textAlign: "center",
    maxW: "4",
    minW: "4",
    color: "transparent",
    userSelect: "none",
    overflow: "clip",
    px: "0",
    py: "0",
  },
  cell: () => <ActionsCell />,
}
