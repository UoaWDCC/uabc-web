import { HStack, Separator, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { FooterBottom } from "./FooterBottom"
import { FooterBrand } from "./FooterBrand"
import { FooterDecoration } from "./FooterDecoration"
import { FooterLinks } from "./FooterLinks"

export const Footer = memo(() => {
  return (
    <VStack
      as="footer"
      bg={["blackAlpha.50", "whiteAlpha.50"]}
      display="grid"
      gap="xl"
      overflow="clip"
      placeItems="center"
      position="relative"
      px={{ base: "lg", lg: "24" }}
      py={{ base: "3xl", md: "24" }}
    >
      <HStack justifyContent="center" maxW="9xl" w="full">
        <FooterBrand />
        <FooterLinks />
      </HStack>
      <Separator />
      <FooterBottom />
      <FooterDecoration />
    </VStack>
  )
})

Footer.displayName = "Footer"

export { LINKS, SOCIAL_LINKS } from "./constants"
