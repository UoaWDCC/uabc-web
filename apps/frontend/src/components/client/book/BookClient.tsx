"use client"
import { BookACourtSkeleton, NotAuthorised } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"
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
          <BookACourtSkeleton />
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
