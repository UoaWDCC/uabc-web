import type { MemberResponse } from "@/hooks/query/useMembers"

export interface Member {
  id: MemberResponse["id"]
  name: string
  email: MemberResponse["email"]
  prepaidSessions: MemberResponse["prepaidSessions"]
}

export type PendingMember = Omit<Member, "prepaidSessions">
