import { UabcLogo } from "@repo/ui/components/Icon"
import { Heading } from "@repo/ui/components/Primitive"
import { HStack, Text, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { FooterSocialLinks } from "./FooterSocialLinks"

export const FooterBrand = memo(() => {
  return (
    <VStack display={{ base: "none", md: "flex" }} gap="lg">
      <VStack gap="xs">
        <HStack>
          <UabcLogo />
          <Heading.h2 fontSize="6xl" fontWeight="semibold">
            UABC
          </Heading.h2>
        </HStack>
        <Text color="muted" maxW="md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore
        </Text>
      </VStack>
      <FooterSocialLinks display={{ base: "none", lg: "flex" }} />
    </VStack>
  )
})

FooterBrand.displayName = "FooterBrand"
