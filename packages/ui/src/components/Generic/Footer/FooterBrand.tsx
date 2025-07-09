import { UabcLogo } from "@repo/ui/components/Icon"
import { Heading } from "@repo/ui/components/Primitive"
import type { StackProps } from "@yamada-ui/react"
import { HStack, Text, VStack } from "@yamada-ui/react"
import type { ReactNode } from "react"
import { memo } from "react"
import type { SocialLink } from "./constants"
import { FooterSocialLinks } from "./FooterSocialLinks"

export interface FooterBrandProps extends StackProps {
  logo?: ReactNode
  title: string
  description: string
  socialLinks: SocialLink[]
}

export const FooterBrand = memo<FooterBrandProps>(
  ({ logo, title, description, socialLinks, ...props }) => {
    return (
      <VStack display={{ base: "none", md: "flex" }} gap="lg" {...props}>
        <VStack gap="xs">
          <HStack>
            {logo ?? <UabcLogo />}
            <Heading.h2 fontSize="6xl" fontWeight="semibold">
              {title}
            </Heading.h2>
          </HStack>
          <Text color="muted" maxW="md">
            {description}
          </Text>
        </VStack>
        <FooterSocialLinks display={{ base: "none", lg: "flex" }} links={socialLinks} />
      </VStack>
    )
  },
)

FooterBrand.displayName = "FooterBrand"
