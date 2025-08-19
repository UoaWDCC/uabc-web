import { QuickBookSkeleton } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"
import { Suspense } from "react"
import { QuickBookSection } from "@/components/client/QuickBookSection"

/**
 * Server-side wrapper for the quick book section to bound client-side search params with Suspense.
 */
export const QuickBookServerSection = () => {
  return (
    <Suspense
      fallback={
        <Container centerContent layerStyle="container">
          <QuickBookSkeleton />
        </Container>
      }
    >
      <QuickBookSection />
    </Suspense>
  )
}
