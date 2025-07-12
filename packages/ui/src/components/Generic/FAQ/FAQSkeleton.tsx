import type { FAQ } from "@repo/ui/components/Generic"
import { Skeleton, VStack } from "@yamada-ui/react"

/**
 * A skeleton for the {@link FAQ} section, providing a loading state with placeholders for the title and three items.
 *
 * @returns A skeleton for the {@link FAQ} section, providing a loading state with placeholders for the title and items.
 */
export const FAQSkeleton = () => {
  return (
    <VStack
      backdropFilter="blur(15px)"
      bg={["secondary.50", "secondary.900"]}
      border="2px solid"
      borderColor={["gray.100", "gray.900"]}
      boxShadow="0px 1.541px 0px 0px rgba(0, 0, 0, 0.05), 0px 6.164px 6.164px 0px rgba(0, 0, 0, 0.05), 0px 15.41px 15.41px 0px rgba(0, 0, 0, 0.10)"
      data-testid="faq-loading"
      p={{ base: "calc(lg - sm)", md: "lg" }}
      rounded="2xl"
      w="full"
    >
      <Skeleton data-testid="faq-loading-title" h="36px" w="128px" />
      <Skeleton data-testid="faq-loading-item" h="75px" />
      <Skeleton data-testid="faq-loading-item" h="75px" />
      <Skeleton data-testid="faq-loading-item" h="75px" />
    </VStack>
  )
}
