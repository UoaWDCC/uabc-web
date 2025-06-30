"use client"

import { Button } from "@repo/ui/components/Button"
import { Box, HStack, Spacer, Text, VStack } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PendingApprovalCard } from "@/components/Composite/booking/sessions/PendingApprovalCard"
import { SelectSessionList } from "@/components/Composite/booking/sessions/SelectSessionList"
import { CountIndicator } from "@/components/Composite/CountIndicator"
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
      <VStack>
        <HStack height={16}>
          <Text fontSize="sm" fontWeight="medium" maxWidth="70%">
            Please select a badminton session for this week
          </Text>
          <Spacer />
          <CountIndicator
            {...(shake && {
              animation: "shake 0.16s 0s 3",
              color: "destructive",
              borderColor: "destructive",
              borderStyle: "solid",
              borderWidth: "2px",
            })}
            onAnimationEnd={() => setShake(false)}
            width={16}
          >
            {sessionsSelected} / {maxSessions}
          </CountIndicator>
        </HStack>
        <Box marginBottom={4} textAlign="center">
          <Text>TODO fix me</Text>
          <PendingApprovalCard />
        </Box>
        <SelectSessionList
          _empty={{
            flexGrow: 1,
            _after: {
              display: "grid",
              height: "full",
              width: "full",
              flexGrow: 1,
              placeItems: "center",
              fontSize: "lg",
              fontWeight: "medium",
              color: "tertiary.700",
              content: "'No more sessions for this week'",
            },
          }}
          flexGrow={1}
          isMember={isMember}
          maxSessions={maxSessions}
          onLimitReached={() => setShake(true)}
        />
      </VStack>

      <Spacer />

      <Button
        // TODO: check if needs approval
        disabled={sessionsSelected === 0}
        onClick={() => push("/sessions/select-play-level")}
        width="full"
      >
        Next
      </Button>
    </>
  )
}
