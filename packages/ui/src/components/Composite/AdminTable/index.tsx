"use client"

import { memo } from "react"
import { Filter } from "./Filter"
import { MemberManagementProvider } from "./MemberManagementContext"
import { PagingTable } from "./PagingTable"

export const AdminMembers = memo(() => {
  return (
    <MemberManagementProvider>
      <Filter />
      <PagingTable />
    </MemberManagementProvider>
  )
})

AdminMembers.displayName = "AdminMembers"
