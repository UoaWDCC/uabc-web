"use client"
import { FAQ } from "@repo/ui/components/Generic"
import { Skeleton, Text } from "@yamada-ui/react"
import { useFaq } from "@/services/cms/faq/FaqQuery"

export const FaqSection = () => {
  const { data: faqData, isLoading, isError } = useFaq()

  if (isLoading) {
    return <Skeleton borderRadius="xl" data-testid="faq-loading" height="sm" width="full" />
  }

  if (isError) {
    return <Text>Failed to load FAQs</Text>
  }

  return (
    <FAQ
      items={faqData?.questions || []}
      richTextProps={{ mediaBaseUrl: process.env.NEXT_PUBLIC_URL }}
    />
  )
}
