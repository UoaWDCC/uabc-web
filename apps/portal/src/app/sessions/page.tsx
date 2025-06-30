import { Heading } from "@repo/ui/components/Heading"
import { LogOutIcon } from "@yamada-ui/lucide"
import { Container, HStack, Spacer, Text, VStack } from "@yamada-ui/react"
import Image from "next/image"
import { PrepaidSessionsCounter } from "@/components/Composite/booking/sessions/PrepaidSessionsCounter"
import { LogOutButton } from "@/components/Composite/LogOutButton"
import type { CurrentUserProps } from "@/lib/hoc/withCurrentUser"
import withCurrentUser from "@/lib/hoc/withCurrentUser"
import { getUserFromId } from "@/services/user"
import BadmintonRacketLogo from "../../public/images/BadmintonRacketLogo.png"
import ClientSessionPage from "./client-page"

export const metadata = {
  title: "Session Booking - UABC Booking Portal",
}

async function SelectSessionPage({ currentUser }: CurrentUserProps) {
  const user = (await getUserFromId(currentUser.id)) ?? null

  if (!user) {
    return <Text>User not found</Text>
  }

  return (
    <Container as={VStack} minHeight="100dvh">
      <HStack>
        <Heading>Sessions</Heading>
        <Spacer />
        <LogOutButton>
          <LogOutIcon fontSize={24} />
        </LogOutButton>
      </HStack>
      <HStack backgroundColor="tertiary.50" height={16} padding={4} width="full">
        <Text as="span" fontWeight="medium" paddingRight={1}>
          Hey {user.firstName}!
        </Text>
        <Image
          alt="Badminton Racket Logo"
          className="pointer-events-none select-none"
          height={20}
          src={BadmintonRacketLogo}
          width={20}
        />
        <Spacer />
        {user.member && <PrepaidSessionsCounter prepaidSessions={user.prepaidSessions} />}
      </HStack>
      <ClientSessionPage isMember={!!user.member} prepaidSessions={user.prepaidSessions} />
    </Container>
  )
}

export default withCurrentUser(SelectSessionPage)
