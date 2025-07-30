import { RichText } from "@repo/ui/components/Generic"
import { Heading } from "@repo/ui/components/Primitive"
import { Container, EmptyState, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { use } from "react"
import { getTos } from "@/services/cms/tos/TosService"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service and code of conduct for the University of Auckland Badminton Club.",
}

export default function TermsOfServiceContent() {
  const tos = use(getTos())

  const data = tos?.data

  if (!data) {
    return (
      <EmptyState
        description="Failed to load Terms of Service. Please contact the administrator."
        title="Terms of Service"
      />
    )
  }

  const { title, subtitle, checkInRules, sessionRules, disclaimer } = data

  return (
    <VStack as="main">
      <Container centerContent layerStyle="container">
        <Heading.h1 fontSize="4xl">{title}</Heading.h1>
        <Heading.h2 fontSize="2xl">{subtitle}</Heading.h2>
        <VStack gap="md">
          <Heading.h3 fontSize="xl">{checkInRules.title}</Heading.h3>
          <RichText data={checkInRules.rules} listProps={{ gap: "md" }} />
        </VStack>
        <VStack gap="md">
          <Heading.h3 fontSize="xl">{sessionRules.title}</Heading.h3>
          <RichText data={sessionRules.rules} listProps={{ gap: "md" }} />
        </VStack>
        <VStack gap="md">
          <Heading.h3 fontSize="xl">{disclaimer.title}</Heading.h3>
          <RichText data={disclaimer.disclaimer} listProps={{ gap: "md" }} />
        </VStack>
      </Container>
    </VStack>
  )
}
