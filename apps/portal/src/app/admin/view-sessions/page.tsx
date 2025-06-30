import { Suspense } from "react"

import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { Container } from "@yamada-ui/react"
import ClientViewSessionsPage from "./client-page"

export const metadata = {
  title: "View Sessions - UABC Booking Portal",
}

export default function ViewSessionsPage() {
  return (
    <Container centerContent minH="100dvh">
      <BackNavigationBar pathName="/admin" title="View Sessions" />
      <Suspense>
        <ClientViewSessionsPage />
      </Suspense>
    </Container>
  )
}
