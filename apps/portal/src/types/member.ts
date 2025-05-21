export interface MemberResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  prepaidSessions: number
}

export interface Member {
  id: MemberResponse["id"]
  name: string
  email: MemberResponse["email"]
  prepaidSessions: MemberResponse["prepaidSessions"]
}

export type PendingMember = Omit<Member, "prepaidSessions">
