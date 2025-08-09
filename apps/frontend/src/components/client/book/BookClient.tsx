"use client"
import { BookACourtSkeleton, NotAuthorised } from "@repo/ui/components/Generic"
import { Heading } from "@repo/ui/components/Primitive"
import { Container, VStack } from "@yamada-ui/react"
import { RoleGuard } from "@/context/RoleWrappers"
import { BookFlow } from "./BookFlow"

export const BookClient = () => {
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
          <BookFlow auth={auth} />
        </Container>
      )}
    </RoleGuard>
  )
}
