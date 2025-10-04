import { VStack } from "@yamada-ui/react"
import { OnboardingServerSection } from "@/components/server/OnboardingServerSection"

export default function OnboardingPage() {
  return (
    <VStack as="main">
      <OnboardingServerSection />
    </VStack>
  )
}
