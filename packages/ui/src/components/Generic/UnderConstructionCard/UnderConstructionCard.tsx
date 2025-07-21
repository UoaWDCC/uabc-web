"use client"

import { Button, type ButtonProps, Heading } from "@repo/ui/components/Primitive"
import { Card, CardBody, CardHeader, Text } from "@yamada-ui/react"
import NextLink from "next/link"

/**
 * Props for {@link UnderConstructionCard} component
 */
export interface UnderConstructionCardProps {
  /**
   * The title to display in the card header
   *
   * @defaultValue "Feature is Under Construction 🔧"
   */
  title?: string
  /**
   * The description text to display in the card body
   *
   * @defaultValue "Our team is busy working on this page.\nCheck back later!"
   */
  description?: string
  /**
   * Label for the return button
   *
   * @defaultValue "Return"
   */
  returnLabel?: string
  /**
   * Props for the return button
   */
  buttonProps?: ButtonProps
}

/**
 * Card to display when a page is under construction, with a return button.
 *
 * @param props UnderConstructionCard component properties
 * @returns A styled card communicating that the feature is under construction
 */
export const UnderConstructionCard = ({
  title = "Feature is Under Construction 🔧",
  description = "Our team is busy working on this page.\nCheck back later!",
  returnLabel = "Return",
  buttonProps,
}: UnderConstructionCardProps) => {
  return (
    <Card
      alignItems="center"
      backdropBlur="15px"
      backdropFilter="auto"
      bg={["secondary.50", "secondary.800"]}
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
      gap="md"
      justifyContent="center"
      layerStyle="gradientBorder"
      py={{ base: "lg", md: "4xl" }}
      rounded="3xl"
      w={{ base: "full", md: "2xl" }}
    >
      <CardHeader pt="0">
        <Heading.h3
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight={{ base: "semibold", md: "medium" }}
          textAlign="center"
        >
          {title}
        </Heading.h3>
      </CardHeader>
      <CardBody p="0">
        <Text fontSize={{ base: "sm", md: "md" }} textAlign="center" whiteSpace="break-spaces">
          {description}
        </Text>
        <Button as={NextLink} colorScheme="primary" href="/" placeSelf="center" {...buttonProps}>
          {returnLabel}
        </Button>
      </CardBody>
    </Card>
  )
}

UnderConstructionCard.displayName = "UnderConstructionCard"
