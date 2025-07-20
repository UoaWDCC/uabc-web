import { UabcLogo } from "@repo/ui/components/Icon"
import { Heading, Image } from "@repo/ui/components/Primitive"
import type { StackProps } from "@yamada-ui/react"
import { HStack, Text, VStack } from "@yamada-ui/react"
import { memo } from "react"
import type { SocialLink } from "./constants"
import { FooterSocialLinks } from "./FooterSocialLinks"

export interface FooterBrandProps extends StackProps {
  logo?: {
    url: string
    alt: string
    width: number
    height: number
  }
  title: string
  description: string
  socialLinks: SocialLink[]
}

export const FooterBrand = memo<FooterBrandProps>(
  ({ logo, title, description, socialLinks, ...props }) => {
    return (
      <VStack display={{ base: "none", md: "flex" }} gap="lg" {...props}>
        <VStack gap="xs">
          <HStack alignItems="center">
            {logo?.url ? (
              <Image
                alt={logo.alt}
                h="12"
                height={logo.height ?? 200}
                src={logo.url}
                w="12"
                width={logo.width ?? 200}
              />
            ) : (
              <UabcLogo />
            )}
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
