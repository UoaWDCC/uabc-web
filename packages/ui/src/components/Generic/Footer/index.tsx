import type { StackProps } from "@yamada-ui/react"
import { HStack, Separator, VStack } from "@yamada-ui/react"
import type { ReactNode } from "react"
import { memo } from "react"
import { MOCK_LINKS, MOCK_SOCIAL_LINKS } from "./constants"
import { FooterBottom, type FooterBottomProps } from "./FooterBottom"
import { FooterBrand, type FooterBrandProps } from "./FooterBrand"
import { FooterDecoration } from "./FooterDecoration"
import { FooterLinks, type FooterLinksProps } from "./FooterLinks"

export interface FooterProps extends StackProps {
  brand?: Omit<FooterBrandProps, "socialLinks">
  bottomProps?: Omit<FooterBottomProps, "socialLinks">
  links?: FooterLinksProps["links"]
  socialLinks?: FooterBottomProps["socialLinks"]
  decoration?: ReactNode
}

export const Footer = memo<FooterProps>(
  ({
    brand = {
      title: "UABC",
      description: "The largest university badminton club in New Zealand!",
    },
    bottomProps = {
      copyrightName: "© 2025 University of Auckland Badminton Club.",
      credits: "Developed by the 2025 WDCC UABC Team",
    },
    links = MOCK_LINKS,
    socialLinks = MOCK_SOCIAL_LINKS,
    decoration = <FooterDecoration />,
    ...props
  }) => {
    return (
      <VStack
        as="footer"
        bg={["gray.50", "gray.950"]}
        display="grid"
        gap="xl"
        overflow="clip"
        placeItems="center"
        px={{ base: "lg", lg: "24" }}
        py={{ base: "3xl", md: "24" }}
        w="full"
        zIndex={1}
        {...props}
      >
        <HStack justifyContent="center" maxW="8xl" position="relative" w="full">
          <FooterBrand {...brand} socialLinks={socialLinks} />
          <FooterLinks links={links} />
          {decoration}
        </HStack>
        <Separator maxW="8xl" />
        <FooterBottom maxW="8xl" {...bottomProps} socialLinks={socialLinks} />
      </VStack>
    )
  },
)

Footer.displayName = "Footer"

export * from "./constants"
