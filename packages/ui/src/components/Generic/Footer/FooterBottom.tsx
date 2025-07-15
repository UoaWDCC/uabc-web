import type { StackProps } from "@yamada-ui/react"
import { Center, Spacer, Stack, Text, VStack } from "@yamada-ui/react"
import { memo } from "react"
import type { SocialLink } from "./constants"
import { FooterSocialLinks } from "./FooterSocialLinks"

export interface FooterBottomProps extends StackProps {
  socialLinks: SocialLink[]
  copyrightName: string
  credits: string
}

export const FooterBottom = memo<FooterBottomProps>(
  ({ socialLinks, copyrightName, credits, ...props }) => {
    return (
      <Stack
        as={Center}
        flexDir={{ base: "column", lg: "row" }}
        fontSize="md"
        maxW="9xl"
        w="full"
        {...props}
      >
        <FooterSocialLinks
          display={{ base: "flex", lg: "none" }}
          iconProps={{ fontSize: "4xl" }}
          links={socialLinks}
        />
        <VStack
          fontSize="sm"
          gap={{ base: "xs", lg: "sm" }}
          textAlign={{ base: "center", lg: "left" }}
        >
          <Text color="muted">{copyrightName}</Text>
          <Text color="muted">All rights reserved.</Text>
        </VStack>
        <Spacer display={{ base: "none", lg: "flex" }} />
        <Text color="muted" display={{ base: "none", lg: "block" }} fontSize="sm" textWrap="nowrap">
          {credits}
        </Text>
      </Stack>
    )
  },
)

FooterBottom.displayName = "FooterBottom"
