"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { twJoin } from "tailwind-merge"

import { CountIndicator } from "@/components/Composite/CountIndicator"
import { PendingApprovalAlert } from "@/components/Composite/booking/sessions/PendingApprovalAlert"
import { SelectSessionList } from "@/components/Composite/booking/sessions/SelectSessionList"
import { Button } from "@/components/Generic/ui/button"
import { MEMBER_MAX_SESSIONS, NON_MEMBER_MAX_SESSIONS } from "@/lib/constants"
import { useCartStore } from "@/stores/useCartStore"

interface ClientSessionPageProps {
  isMember: boolean
  prepaidSessions: number
}

export default function ClientSessionPage({ isMember, prepaidSessions }: ClientSessionPageProps) {
  const { push } = useRouter()

  const sessionsSelected = useCartStore((state) => state.cart.length)
  const [shake, setShake] = useState(false)

  const memberMaxSessions = Math.min(prepaidSessions, MEMBER_MAX_SESSIONS)
  const maxSessions = isMember ? memberMaxSessions : NON_MEMBER_MAX_SESSIONS

  return (
    <>
      <div className="flex h-16 items-center justify-between p-4">
        <p className="max-w-[70%] font-medium text-sm">
          Please select a badminton session for this week
        </p>
        <CountIndicator
          className={twJoin(
            "w-16",
            shake && "error-shake border-2 border-destructive border-solid text-destructive",
          )}
          onAnimationEnd={() => setShake(false)}
        >
          {sessionsSelected} / {maxSessions}
        </CountIndicator>
      </div>
      <div className="mx-4 mb-4 text-center">
        <p>TODO fix me</p>
        <PendingApprovalAlert />
      </div>
      <SelectSessionList
        className="mx-4 grow empty:grow empty:after:grid empty:after:h-full empty:after:w-full empty:after:grow empty:after:place-items-center empty:after:font-medium empty:after:text-lg empty:after:text-tertiary/70 empty:after:content-['No_more_sessions_for_this_week']"
        isMember={isMember}
        maxSessions={maxSessions}
        onLimitReached={() => setShake(true)}
      />

      <div className="mx-4 mt-6 mb-10 flex justify-center">
        <Button
          // TODO: check if needs approval
          className="w-full"
          disabled={sessionsSelected === 0}
          onClick={() => push("/sessions/select-play-level")}
        >
          Next
        </Button>
      </div>
    </>
  )
}
