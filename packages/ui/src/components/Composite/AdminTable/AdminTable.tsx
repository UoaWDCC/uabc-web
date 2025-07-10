"use client"

import { memo } from "react"
import { Filter } from "./Filter"
import { MemberManagementProvider } from "./MemberManagementContext"
import { PagingTable } from "./PagingTable"

export const AdminTable = memo(() => {
  return (
    <MemberManagementProvider>
      <Filter />
      <PagingTable />
    </MemberManagementProvider>
  )
})

AdminTable.displayName = "AdminTable"
