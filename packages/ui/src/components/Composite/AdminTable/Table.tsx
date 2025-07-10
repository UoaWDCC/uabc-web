"use client"

import type { User } from "@repo/shared/payload-types"
import type { TdProps } from "@yamada-ui/react"
import type { Cell, Column, PagingTableProps } from "@yamada-ui/table"
import { Table } from "@yamada-ui/table"
import type { FC } from "react"
import { memo, useMemo } from "react"
import {
  ACTIONS_COLUMN,
  EMAIL_COLUMN,
  NAME_COLUMN,
  REMAINING_SESSIONS_COLUMN,
  ROLE_COLUMN,
  UNIVERSITY_COLUMN,
} from "./Columns"
import { useMemberManagement } from "./MemberManagementContext"
import { SkeletonTable } from "./SkeletonTable"

export const MemberManagementTable: FC = memo(() => {
  const { paginatedMembers, isLoading, visibleColumns } = useMemberManagement()

  const allColumns = useMemo<Record<string, Column<User>>>(
    () => ({
      name: NAME_COLUMN,
      email: EMAIL_COLUMN,
      role: ROLE_COLUMN,
      remainingSessions: REMAINING_SESSIONS_COLUMN,
      university: UNIVERSITY_COLUMN,
      actions: ACTIONS_COLUMN,
    }),
    [],
  )

  const columns = useMemo<Column<User>[]>(() => {
    return visibleColumns.map((columnKey) => allColumns[columnKey]).filter(Boolean)
  }, [visibleColumns, allColumns])

  const cellProps = useMemo<PagingTableProps<User>["cellProps"]>(() => {
    return ({ column, row }: Cell<User & { empty?: boolean }, unknown>) => {
      const props: TdProps = { verticalAlign: "middle" }

      if (row.original.empty) {
        if (column.columnDef.header === "Name") {
          props.colSpan = visibleColumns.length
          props.textAlign = "center"
          props.color = "muted"
          props.h = "3xs"
        } else {
          props.display = "none"
        }
      }

      if (column.columnDef.id === "actions") {
        props.pl = "0"
        props.pr = "xs"
        props.py = "xs"
        props.display = "flex"
        props.justifyContent = "flex-end"
      }

      return props
    }
  }, [visibleColumns.length])

  const hasData = !!paginatedMembers.length

  const resolvedData = hasData
    ? paginatedMembers
    : [
        {
          id: "",
          firstName: "No members found",
          email: "",
          role: "casual" as const,
          remainingSessions: null,
          university: null,
          lastName: null,
          phoneNumber: null,
          playLevel: null,
          gender: null,
          dietaryRequirements: null,
          studentId: null,
          studentUpi: null,
          image: null,
          updatedAt: "",
          createdAt: "",
          empty: true,
        },
      ]

  if (isLoading) {
    return <SkeletonTable />
  }

  return (
    <Table<User & { empty?: boolean }>
      borderCollapse="separate"
      borderWidth="1px"
      cellProps={cellProps}
      columns={columns}
      data={resolvedData}
      highlightOnHover={hasData}
      highlightOnSelected={hasData}
      rounded="md"
      rowId="id"
      rowsClickSelect={hasData}
      sx={{ "tbody > tr:last-of-type > td": { borderBottomWidth: "0px" } }}
    />
  )
})

MemberManagementTable.displayName = "MemberManagementTable"
