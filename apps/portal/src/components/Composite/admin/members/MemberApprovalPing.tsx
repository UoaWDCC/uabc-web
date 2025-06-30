"use client"

import { usePendingMembers } from "@/hooks/query/usePendingMembers"

export function MemberApprovalPing() {
  const { data } = usePendingMembers()

  if (!data?.length) return null

  return (
    <div className="-translate-x-1/4 -translate-y-1/4 absolute top-0 left-0">
      <span className="relative flex size-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="inline-flex size-4 rounded-full bg-red-500" />
      </span>
    </div>
  )
}
