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
  const { paginatedMembers, isLoading } = useMemberManagement()

  const columns = useMemo<Column<User>[]>(
    () => [
      NAME_COLUMN,
      EMAIL_COLUMN,
      ROLE_COLUMN,
      REMAINING_SESSIONS_COLUMN,
      UNIVERSITY_COLUMN,
      ACTIONS_COLUMN,
    ],
    [],
  )

  const cellProps = useMemo<PagingTableProps<User>["cellProps"]>(() => {
    return ({ column, row }: Cell<User & { empty?: boolean }, unknown>) => {
      const props: TdProps = { verticalAlign: "middle" }

      if (row.original.empty) {
        if (column.columnDef.header === "Name") {
          props.colSpan = 6
          props.textAlign = "center"
          props.color = "muted"
          props.h = "3xs"
        } else {
          props.display = "none"
        }
      }

      if (column.columnDef.header === "Actions") {
        props.w = "4"
      }

      return props
    }
  }, [])

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
      rounded="md"
      rowId="id"
      selectColumnProps={false}
      sx={{ "tbody > tr:last-of-type > td": { borderBottomWidth: "0px" } }}
    />
  )
})

MemberManagementTable.displayName = "MemberManagementTable"
