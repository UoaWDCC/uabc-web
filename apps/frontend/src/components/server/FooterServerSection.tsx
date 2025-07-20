import { Footer, resolveUrl } from "@repo/ui/components/Generic"
import { LinkTreeIcon } from "@repo/ui/components/Icon"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import { use } from "react"
import { getFooter } from "@/services/cms/footer/FooterService"

/**
 * Server-side component to fetch and render the footer section.
 *
 * @returns A footer section component.
 */
export const FooterServerSection = () => {
  const { data: footerResponseData } = use(getFooter())

  const logoUrl = footerResponseData.logo?.url
    ? resolveUrl(footerResponseData.logo?.url, process.env.NEXT_PUBLIC_API_URL)
    : undefined

  const bottomData = {
    copyrightName: footerResponseData.copyright,
    credits: "Developed by the 2025 WDCC UABC Team.",
  }

  const brandData = {
    logo: logoUrl
      ? {
          src: logoUrl,
          alt: footerResponseData.logo?.alt ?? "",
          width: footerResponseData.logo?.width ?? 200,
          height: footerResponseData.logo?.height ?? 200,
        }
      : undefined,
    title: footerResponseData.title,
    description: footerResponseData.description,
  }

  const linksData = {
    linkGroup1: footerResponseData.linkGroup1 ?? { title: "", links: [] },
    linkGroup2: footerResponseData.linkGroup2 ?? { title: "", links: [] },
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

  return (
    <Footer
      bottomProps={bottomData}
      brand={brandData}
      links={linksData}
      socialLinks={socialLinksData}
    />
  )
}
