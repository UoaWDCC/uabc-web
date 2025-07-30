import type { ContainerProps } from "@yamada-ui/react"
import { Container, HStack, Separator } from "@yamada-ui/react"
import type { ReactNode } from "react"
import { memo } from "react"
import { FooterBottom, type FooterBottomProps } from "./FooterBottom"
import { FooterBrand, type FooterBrandProps } from "./FooterBrand"
import { FooterDecoration } from "./FooterDecoration"
import { FooterLinks, type FooterLinksProps } from "./FooterLinks"

export interface FooterProps extends ContainerProps {
  brand?: Omit<FooterBrandProps, "socialLinks">
  bottomProps?: Omit<FooterBottomProps, "socialLinks">
  links: FooterLinksProps["links"]
  socialLinks: FooterBottomProps["socialLinks"]
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
    links,
    socialLinks,
    decoration,
    ...props
  }) => {
    return (
      <Container
        as="footer"
        bg={["gray.50", "gray.950"]}
        centerContent
        overflow="clip"
        py={{ base: "3xl", md: "24" }}
        w="full"
        zIndex={1}
        {...props}
      >
        <HStack
          justifyContent="center"
          layerStyle="container"
          position="relative"
          px={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
          w="full"
        >
          <FooterBrand {...brand} socialLinks={socialLinks} />
          <FooterLinks links={links} />
          {decoration ? decoration : <FooterDecoration />}
        </HStack>

        <Separator layerStyle="container" w="full" />

        <FooterBottom
          layerStyle="container"
          px={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
          {...bottomProps}
          socialLinks={socialLinks}
        />
      </Container>
    )
  },
)

Footer.displayName = "Footer"

export * from "./constants"
