"use client"
import { api } from "@/lib/api"
import type { Faq } from "@repo/shared/payload-types"
// TODO: THIS IS FOR TESTING ONLY, REPLACE WITH ACTUAL ONE LATER
import { Heading } from "@repo/ui/components/Heading"
import { RichText } from "@repo/ui/components/RichText"
import { useQuery } from "@tanstack/react-query"
import { Container, EmptyState, Text, VStack } from "@yamada-ui/react"

interface FaqResponse {
  data: Faq
}

export default function FaqPage() {
  const { data, isLoading, error } = useQuery<FaqResponse>({
    queryKey: ["faq"],
    queryFn: () => api.get("/api/globals/faq"),
  })

  if (isLoading) {
    return (
      <Container as="main">
        <Heading.h1>FAQ</Heading.h1>
        <Text>Loading...</Text>
      </Container>
    )
  }

  if (error) {
    return (
      <Container as="main">
        <Heading.h1>FAQ</Heading.h1>
        <Text>Error loading FAQ: {error instanceof Error ? error.message : "Unknown error"}</Text>
      </Container>
    )
  }

  if (!data?.data) {
    return (
      <Container as="main">
        <EmptyState
          description="Please check back later or contact us for more information."
          title="No FAQ found"
        />
      </Container>
    )
  }

  const faqData = data.data

  return (
    <Container as="main">
      <Heading.h1>{faqData.title || "FAQ"}</Heading.h1>
      <VStack gap="lg" mt="md">
        {faqData.questions && faqData.questions.length > 0 ? (
          faqData.questions.map((question, index) => (
            <VStack key={question.id || index}>
              <Heading.h2>{question.questionTitle}</Heading.h2>
              <RichText
                data={question.description}
                mediaBaseUrl={process.env.NEXT_PUBLIC_API_URL}
              />
            </VStack>
          ))
        ) : (
          <EmptyState
            description="No questions available at the moment."
            title="No FAQ questions found"
          />
        )}
      </VStack>
    </Container>
  )
}
