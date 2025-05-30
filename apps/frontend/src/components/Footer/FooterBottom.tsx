import { Center, Spacer, Stack, Text, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { FooterSocialLinks } from "./FooterSocialLinks"

export const FooterBottom = memo(() => {
  return (
    <Stack as={Center} flexDir={{ base: "column", lg: "row" }} fontSize="md" maxW="9xl" w="full">
      <FooterSocialLinks display={{ base: "flex", lg: "none" }} iconSize="4xl" />
      <VStack
        fontSize="sm"
        gap={{ base: "xs", lg: "sm" }}
        textAlign={{ base: "center", lg: "left" }}
      >
        <Text color="muted">
          &copy; {new Date().getFullYear()} University of Auckland Badminton Club.
        </Text>
        <Text color="muted">All rights reserved.</Text>
      </VStack>
      <Spacer display={{ base: "none", lg: "flex" }} />
      <Text color="muted" display={{ base: "none", lg: "block" }} fontSize="sm" textWrap="nowrap">
        Developed by the 2025 WDCC UABC Team
      </Text>
    </Stack>
  )
})

FooterBottom.displayName = "FooterBottom"
