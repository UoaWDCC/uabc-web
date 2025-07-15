"use client"
import { Footer } from "@repo/ui/components/Generic"
import { LinkTreeIcon } from "@repo/ui/components/Icon"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
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

  const socialLinksData = [
    {
      label: "LinkTree",
      url: footerResponseData.linktree,
      icon: LinkTreeIcon,
    },
    {
      label: "Facebook",
      url: footerResponseData.facebook,
      icon: FacebookIcon,
    },
    {
      label: "Instagram",
      url: footerResponseData.instagram,
      icon: InstagramIcon,
    },
  ]

  const linksData = {
    linkGroup1: footerResponseData.linkGroup1 ?? { title: "", links: [] },
    linkGroup2: footerResponseData.linkGroup2 ?? { title: "", links: [] },
  }

  const bottomData = {
    copyrightName: footerResponseData.copyright,
    credits: "Developed by the 2025 WDCC UABC Team.",
  }

  const brandData = {
    title: footerResponseData.title,
    description: footerResponseData.description,
  }

  return (
    <Footer
      bottomProps={bottomData}
      brand={brandData}
      links={linksData}
      socialLinks={socialLinksData}
    />
  )
}
