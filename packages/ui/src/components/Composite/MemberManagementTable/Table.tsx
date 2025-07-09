"use client"

import type { TdProps } from "@yamada-ui/react"
import { assignRef } from "@yamada-ui/react"
import type { Cell, Column, PagingTableProps } from "@yamada-ui/table"
import { Table } from "@yamada-ui/table"
import type { FC, Reducer, RefObject } from "react"
import { memo, useEffect, useMemo, useReducer } from "react"
import {
  ACTIONS_COLUMN,
  EMAIL_COLUMN,
  type Member,
  NAME_COLUMN,
  PREPAID_SESSIONS_COLUMN,
} from "./Columns"
import { SkeletonTable } from "./SkeletonTable"

const FIRST_NAMES = [
  "John",
  "Jane",
  "Jim",
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Ivy",
  "Jack",
  "Kara",
  "Liam",
  "Mona",
  "Nate",
  "Olive",
  "Paul",
  "Quinn",
  "Rita",
  "Sam",
  "Tina",
  "Uma",
  "Vince",
  "Wendy",
  "Xander",
  "Yara",
  "Zane",
  "Fay",
  "Gus",
  "Hope",
  "Iris",
  "Jude",
  "Kurt",
  "Lara",
  "Mick",
  "Nina",
  "Omar",
  "Pia",
]

const LAST_NAMES = [
  "Doe",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Garcia",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
]

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)]
}

const useMembers = () => {
  const data = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const firstName = getRandomItem(FIRST_NAMES)
      const lastName = getRandomItem(LAST_NAMES)
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`
      const prepaidSessions = getRandomInt(-1, 20)
      return {
        id: (i + 1).toString(),
        firstName,
        lastName,
        email,
        prepaidSessions,
      }
    })
  }, [])

  return {
    data,
    isLoading: false,
  }
}

export interface MemberManagementTableProps {
  filterRef: RefObject<(value: string) => void>
  perPageRef: RefObject<(value: number) => void>
  currentPageRef: RefObject<(value: number) => void>
  onTotalPageChange: (value: number) => void
}

type State = {
  filterValue: string
  currentPage: number
  totalPerPage: number
}

type Action =
  | { type: "SET_FILTER"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filterValue: action.payload, currentPage: 1 }
    case "SET_PAGE":
      return { ...state, currentPage: action.payload }
    case "SET_PAGE_SIZE":
      return { ...state, totalPerPage: action.payload, currentPage: 1 }
    default:
      return state
  }
}

export const MemberManagementTable: FC<MemberManagementTableProps> = memo(
  ({ filterRef, perPageRef, currentPageRef, onTotalPageChange }) => {
    const { data, isLoading } = useMembers()

    const [state, dispatch] = useReducer(reducer, {
      filterValue: "",
      currentPage: 1,
      totalPerPage: 20,
    })

    const { filterValue, currentPage, totalPerPage } = state

    const members = useMemo(
      () =>
        data?.map((member) => ({
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          email: member.email,
          prepaidSessions: member.prepaidSessions,
        })) ?? [],
      [data],
    )

    const filteredMembers = useMemo(() => {
      if (!filterValue) {
        return members
      }
      const lowercaseFilter = filterValue.toLowerCase()
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(lowercaseFilter) ||
          member.email.toLowerCase().includes(lowercaseFilter) ||
          member.prepaidSessions.toString().includes(lowercaseFilter),
      )
      return filtered
    }, [members, filterValue])

    const totalPages = useMemo(() => {
      return Math.ceil(filteredMembers.length / totalPerPage)
    }, [filteredMembers, totalPerPage])

    const paginatedMembers = useMemo(() => {
      const startIndex = (currentPage - 1) * totalPerPage
      const endIndex = startIndex + totalPerPage
      return filteredMembers.slice(startIndex, endIndex)
    }, [filteredMembers, currentPage, totalPerPage])

    const columns = useMemo<Column<Member>[]>(
      () => [NAME_COLUMN, EMAIL_COLUMN, PREPAID_SESSIONS_COLUMN, ACTIONS_COLUMN],
      [],
    )

    const cellProps = useMemo<PagingTableProps<Member>["cellProps"]>(() => {
      return ({ column, row }: Cell<Member & { empty?: boolean }, unknown>) => {
        const props: TdProps = { verticalAlign: "middle" }

        if (row.original.empty) {
          if (column.columnDef.header === "Name") {
            props.colSpan = 5
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

    assignRef(filterRef, (value: string) => {
      dispatch({ type: "SET_FILTER", payload: value })
    })

    assignRef(perPageRef, (value: number) => {
      dispatch({ type: "SET_PAGE_SIZE", payload: value })
    })

    assignRef(currentPageRef, (value: number) => {
      dispatch({ type: "SET_PAGE", payload: value })
    })

    const hasData = !!paginatedMembers.length

    useEffect(() => {
      if (hasData) {
        onTotalPageChange(totalPages)
      }
    }, [hasData, totalPages, onTotalPageChange])

    const resolvedData = hasData
      ? paginatedMembers
      : [
          {
            id: "",
            name: "No members found",
            email: "",
            prepaidSessions: 0,
            empty: true,
          },
        ]

    if (isLoading) {
      return <SkeletonTable />
    }

    return (
      <Table<Member & { empty?: boolean }>
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
  },
)

MemberManagementTable.displayName = "MemberManagementTable"
