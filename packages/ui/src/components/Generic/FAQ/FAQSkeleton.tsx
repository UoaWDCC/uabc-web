import type { FAQ } from "@repo/ui/components/Generic"
import {
  Accordion,
  AccordionItem,
  AccordionLabel,
  For,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { Heading } from "../../Primitive"

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
      <Skeleton data-testid="faq-loading-title">
        <Heading as="h2" fontSize="4xl">
          FAQ
        </Heading>
      </Skeleton>
      <Accordion
        icon={
          <Skeleton borderRadius="md">
            <IconButton />
          </Skeleton>
        }
        pointerEvents="none"
        w="full"
      >
        <For each={Array.from({ length: 3 })}>
          {(_, index) => (
            <AccordionItem
              _last={{
                borderBottomWidth: "0",
              }}
              key="faq-skeleton-item"
            >
              <AccordionLabel fontSize="lg" p={{ base: "md", lg: "calc(lg - sm)" }}>
                <Skeleton data-testid="faq-loading-item">
                  <Text textOverflow="clip">Question {index + 1} Placeholder Text</Text>
                </Skeleton>
              </AccordionLabel>
            </AccordionItem>
          )}
        </For>
      </Accordion>
    </VStack>
  )
}
