import { EllipsisVerticalIcon } from "@yamada-ui/lucide"
import { Bleed, IconButton, Text } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { memo, useCallback } from "react"

const NameCell = memo(({ value }: { value: string }) => (
  <Text as="span" lineClamp={1}>
    {value}
  </Text>
))

NameCell.displayName = "NameCell"

export interface Member {
  id: string
  name: string
  email: string
  prepaidSessions: number
}

export const NAME_COLUMN: Column<Member> = {
  accessorKey: "name",
  header: "Name",
  css: { w: "200px" },
  cell: ({ getValue }) => {
    const value = getValue() as string
    return <NameCell value={value} />
  },
}

const EmailCell = memo(({ value }: { value: string }) => (
  <Text as="span" lineClamp={1}>
    {value}
  </Text>
))

EmailCell.displayName = "EmailCell"

export const EMAIL_COLUMN: Column<Member> = {
  accessorKey: "email",
  header: "Email",
  cell: ({ getValue }) => {
    const value = getValue() as string
    return <EmailCell value={value} />
  },
}

const PrepaidSessionsCell = memo(({ value }: { value: number }) => (
  <Text as="span" display="block" textAlign="center">
    {value}
  </Text>
))

PrepaidSessionsCell.displayName = "PrepaidSessionsCell"

export const PREPAID_SESSIONS_COLUMN: Column<Member> = {
  accessorKey: "prepaidSessions",
  header: "Prepaid Sessions",
  css: { minW: "200px", textAlign: "center" },
  cell: ({ getValue }) => {
    const value = getValue() as number
    return <PrepaidSessionsCell value={value} />
  },
}

const EditButton = memo(() => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <IconButton onClick={handleClick} size="sm" variant="ghost">
      <EllipsisVerticalIcon />
    </IconButton>
  )
})

EditButton.displayName = "EditButton"

const ActionsCell = memo(() => (
  <Bleed block="2" inline="3">
    <EditButton />
  </Bleed>
))

ActionsCell.displayName = "ActionsCell"

export const ACTIONS_COLUMN: Column<Member> = {
  id: "actions",
  header: "",
  css: { textAlign: "center" },
  cell: () => <ActionsCell />,
}
