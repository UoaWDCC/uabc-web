"use client"
import { FAQ, FAQSkeleton } from "@repo/ui/components/Generic"
import { Text } from "@yamada-ui/react"
import { useFaq } from "@/services/cms/faq/FaqQuery"

/**
 * A section that displays frequently asked questions (FAQs). Fetches data using the {@link useFaq} hook and displays a loading and an error state when necessary.
 *
 * @returns A section with fetched FAQs
 */
export const FaqSection = () => {
  const { data: faqData, isLoading, isError } = useFaq()

  if (isLoading) {
    return <FAQSkeleton />
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
