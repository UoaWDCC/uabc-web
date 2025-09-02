import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { FaqSection } from "@/components/client/FaqSection"
import { HeaderSection } from "@/components/client/HeaderSection"
import { LocationBubbleSection } from "@/components/client/LocationBubbleSection"
import { AboutUsServerSection } from "@/components/server/AboutUsServerSection"
import { QuickBookServerSection } from "@/components/server/QuickBookServerSection"

export const metadata: Metadata = {
  title: "Home | UABC",
  description:
    "Welcome to the homepage of UABC, New Zealand's largest student badminton club. We run weekly badminton sessions and fun social events to connect like-minded badminton people!",
}

export default function Home() {
  return (
    <VStack as="main">
      <HeaderSection />
      <QuickBookServerSection />
      <LocationBubbleSection />
      <AboutUsServerSection />
      <FaqSection />
    </VStack>
  )
}
