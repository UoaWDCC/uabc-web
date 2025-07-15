import type { StackProps } from "@yamada-ui/react"
import { HStack, Separator, VStack } from "@yamada-ui/react"
import type { ReactNode } from "react"
import { memo } from "react"
import { MOCK_LINK_GROUP_1, MOCK_LINK_GROUP_2, MOCK_SOCIAL_LINKS } from "./constants"
import { FooterBottom, type FooterBottomProps } from "./FooterBottom"
import { FooterBrand, type FooterBrandProps } from "./FooterBrand"
import { FooterDecoration } from "./FooterDecoration"
import { FooterLinks, type FooterLinksProps } from "./FooterLinks"

export interface FooterProps extends StackProps {
  brand?: Omit<FooterBrandProps, "socialLinks">
  bottomProps?: Omit<FooterBottomProps, "socialLinks">
  linkGroup1?: FooterLinksProps["linkGroup1"]
  linkGroup2?: FooterLinksProps["linkGroup2"]
  socialLinks?: FooterBottomProps["socialLinks"]
  decoration?: ReactNode
}

export const Footer = memo<FooterProps>(
  ({
    brand = {
      title: "UABC",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    },
    bottomProps = {
      copyrightName: "University of Auckland Badminton Club",
      credits: "Developed by the 2025 WDCC UABC Team",
    },
    linkGroup1 = MOCK_LINK_GROUP_1,
    linkGroup2 = MOCK_LINK_GROUP_2,
    socialLinks = MOCK_SOCIAL_LINKS,
    decoration = <FooterDecoration />,
    ...props
  }) => {
    return (
      <VStack
        as="footer"
        bg={["blackAlpha.50", "whiteAlpha.50"]}
        display="grid"
        gap="xl"
        overflow="clip"
        placeItems="center"
        px={{ base: "lg", lg: "24" }}
        py={{ base: "3xl", md: "24" }}
        {...Object.fromEntries(
          Object.entries(props).filter(([key]) => key !== "updatedAt" && key !== "createdAt"),
        )}
      >
        <HStack justifyContent="center" maxW="9xl" position="relative" w="full">
          <FooterBrand {...brand} socialLinks={socialLinks} />
          <FooterLinks linkGroup1={linkGroup1} linkGroup2={linkGroup2} />
          {decoration}
        </HStack>
        <Separator />
        <FooterBottom {...bottomProps} socialLinks={socialLinks} />
      </VStack>
    )
  },
)

Footer.displayName = "Footer"

export * from "./constants"
