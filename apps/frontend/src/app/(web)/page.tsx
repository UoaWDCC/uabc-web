import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { FaqSection } from "@/components/client/FaqSection"
import { HeaderSection } from "@/components/client/HeaderSection"
import { LocationBubbleSection } from "@/components/client/LocationBubbleSection"
import { QuickBookSection } from "@/components/client/QuickBookSection"
import { AboutUsServerSection } from "@/components/server/AboutUsServerSection"

export const metadata: Metadata = {
  title: "Home | UABC",
  description:
    "Welcome to the homepage of UABC, New Zealand's largest student badminton club. We run weekly badminton sessions and fun social events to connect like-minded badminton people!",
}

export default async function Home() {
  return (
    <VStack as="main">
      <HeaderSection />
      <QuickBookSection />
      <LocationBubbleSection />
      <AboutUsServerSection />
      <FaqSection />
    </VStack>
  )
}

Home.displayName = "Home"
