"use client"
import { Footer } from "@repo/ui/components/Generic"
import { Text } from "@yamada-ui/react"
import { useFooter } from "@/services/cms/footer/FooterQuery"

/**
 * Client-side component to fetch and render the footer section.
 *
 * @returns The footer section component that displays the footer data.
 */
export const FooterSection = () => {
  const { data: footerResponse, isError, isLoading } = useFooter()
  const footerResponseData = footerResponse?.data?.data

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (isError || !footerResponseData) {
    return <Text>ERROR</Text>
  }

  if (!footerResponseData?.id) {
    return <Text>ERROR: Footer data missing id</Text>
  }

  return (
    <Footer
      {...footerResponseData}
      linkGroup1={footerResponseData.linkGroup1 ?? undefined}
      linkGroup2={footerResponseData.linkGroup2 ?? undefined}
    />
  )
}
