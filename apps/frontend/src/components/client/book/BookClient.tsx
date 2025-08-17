"use client"
import { BookACourtSkeleton, NotAuthorised } from "@repo/ui/components/Generic"
import { Heading } from "@repo/ui/components/Primitive"
import { CircleAlertIcon } from "@yamada-ui/lucide"
import { Container, EmptyState, VStack } from "@yamada-ui/react"
import { RoleGuard } from "@/context/RoleWrappers"
import { mapGameSessionsToSessionItems } from "@/services/game-session/GameSessionAdapter"
import { useGetCurrentGameSessions } from "@/services/game-session/GameSessionQueries"
import { BookFlow } from "./BookFlow"

export const BookClient = () => {
  const { data, isError, error, isLoading } = useGetCurrentGameSessions()

  const sessions = data?.data ? mapGameSessionsToSessionItems(data.data) : []

  return (
    <RoleGuard
      fallback={
        <NotAuthorised
          as="section"
          description="Please login to view your bookings"
          href="/auth/login"
          returnLabel="Login"
          title="You are not logged in"
        />
      }
      loading={
        <Container centerContent layerStyle="container">
          <VStack flex={1} gap="lg" textAlign="center">
            <Heading.h2 fontSize="3xl">Book a court</Heading.h2>
            <BookACourtSkeleton />
          </VStack>
        </Container>
      }
    >
      {(auth) => (
        <Container centerContent layerStyle="container">
          {isLoading ? (
            <VStack flex={1} gap="lg" textAlign="center">
              <Heading.h2 fontSize="3xl">Book a court</Heading.h2>
              <BookACourtSkeleton />
            </VStack>
          ) : isError ? (
            <EmptyState
              description={error?.message ?? "Failed to load sessions."}
              indicator={<CircleAlertIcon />}
              placeSelf="center"
              title="Could not load sessions"
            />
          ) : (
            <BookFlow auth={auth} sessions={sessions} />
          )}
        </Container>
      )}
    </RoleGuard>
  )
}
