import { PlusIcon } from "@yamada-ui/lucide"
import {
  Accordion,
  AccordionItem,
  AccordionLabel,
  AccordionPanel,
  type AccordionProps,
  For,
  Heading,
  type HeadingProps,
  VStack,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import { RichText, type RichTextProps } from "../RichText"
import { type UIFAQItem, UIFAQPropsSchema } from "./schema"

/**
 * Props for {@link FAQ} component
 */
export interface FAQProps extends Omit<AccordionProps, "children"> {
  /**
   * The title for the FAQ section
   * @defaultValue "FAQs"
   */
  title?: string
  /**
   * Array of FAQ items to display
   * Uses the shared FAQ schema structure with questionTitle and description fields
   */
  items: UIFAQItem[]
  /**
   * Props for the FAQ title heading
   */
  titleProps?: HeadingProps
  /**
   * Whether to allow multiple items to be expanded at once
   * @defaultValue false
   */
  allowMultiple?: boolean
  /**
   * Whether to allow toggling (collapsing) expanded items
   * @defaultValue true
   */
  allowToggle?: boolean
  /**
   * Props to pass to RichText components for rich text answers
   */
  richTextProps?: Omit<RichTextProps, "data">
}

/**
 * FAQ component that displays frequently asked questions in an accordion format
 *
 * @param props - FAQ component properties
 * @returns A memoized FAQ component with accordion functionality
 *
 * @example
 * // Basic usage with rich text answers from Payload CMS
 * <FAQ
 *   items={[
 *     { questionTitle: "What is this?", description: richTextData },
 *     { questionTitle: "How do I use it?", description: anotherRichTextData }
 *   ]}
 *   richTextProps={{ mediaBaseUrl: process.env.NEXT_PUBLIC_API_URL }}
 * />
 *
 * @example
 * // With custom title and multiple expansion
 * <FAQ
 *   title="Common Questions"
 *   allowMultiple
 *   items={faqItems}
 * />
 */
export const FAQ = memo(
  forwardRef<HTMLDivElement, FAQProps>(
    (
      {
        title = "FAQs",
        items,
        titleProps,
        allowMultiple = false,
        allowToggle = true,
        richTextProps,
        ...accordionProps
      },
      ref,
    ) => {
      const validatedProps = UIFAQPropsSchema.parse({
        title,
        items,
        allowMultiple,
        allowToggle,
      })
      return (
        <VStack
          backdropFilter="blur(15px)"
          bg={["secondary.50", "secondary.900"]}
          border="2px solid"
          borderColor={["gray.100", "gray.900"]}
          boxShadow="0px 1.541px 0px 0px rgba(0, 0, 0, 0.05), 0px 6.164px 6.164px 0px rgba(0, 0, 0, 0.05), 0px 15.41px 15.41px 0px rgba(0, 0, 0, 0.10)"
          p={{ base: "calc(lg - sm)", md: "lg" }}
          ref={ref}
          rounded="2xl"
          textWrap="pretty"
          w="full"
        >
          {title && (
            <Heading
              as="h2"
              fontSize="4xl"
              fontWeight="semibold"
              textAlign="left"
              w="full"
              {...titleProps}
            >
              {title}
            </Heading>
          )}

          <Accordion
            icon={({ expanded }) => {
              return (
                <PlusIcon
                  h="6"
                  transform={expanded ? "rotate(45deg)" : "rotate(0deg)"}
                  transition="transform 0.2s ease-in-out"
                  w="6"
                />
              )
            }}
            multiple={allowMultiple}
            {...(!allowMultiple && { toggle: allowToggle })}
            variant="basic"
            w="full"
            {...accordionProps}
          >
            <For each={validatedProps.items}>
              {(item, index) => (
                <AccordionItem
                  _last={{
                    borderBottomWidth: "0",
                  }}
                  disabled={item.disabled}
                  key={`faq-${item.questionTitle.slice(0, 50).replace(/\s+/g, "-").toLowerCase()}-${index}`}
                >
                  <AccordionLabel fontSize="lg" p={{ base: "md", lg: "calc(lg - sm)" }}>
                    {item.questionTitle}
                  </AccordionLabel>
                  <AccordionPanel px={{ base: "md", lg: "calc(lg - sm)" }} py="md">
                    <VStack>
                      <RichText data={item.description} {...richTextProps} />
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              )}
            </For>
          </Accordion>
        </VStack>
      )
    },
  ),
)

FAQ.displayName = "FAQ"
