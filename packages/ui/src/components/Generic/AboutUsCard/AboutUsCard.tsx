import { Heading } from "@repo/ui/components/Primitive"
import { Card, CardBody, CardHeader, Text } from "@yamada-ui/react"

/**
 * Props for {@link AboutUsCard} component
 */
export interface AboutUsCardProps {
  /**
   * The title to display in the card header
   */
  title: string
  /**
   * The description text to display in the card body
   */
  description: string
}

/**
 * Card component for displaying "About Us" content with a title and description
 *
 * Renders a styled card with a title heading and description text, designed to
 * provide information about the organization, team members, or services.
 *
 * @param props AboutUsCard component properties
 * @returns A styled card with title and description
 *
 * @example
 * <AboutUsCard
 *   title="Our Mission"
 *   description="We aim to provide exceptional services to our community."
 * />
 */
export const AboutUsCard = ({ title, description }: AboutUsCardProps) => {
  return (
    <Card
      alignItems="center"
      backdropBlur="15px"
      backdropFilter="auto"
      bg={["secondary.50", "secondary.800"]}
      borderColor="transparent"
      borderWidth="1px"
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
      gap="md"
      justifyContent="center"
      layerStyle="gradientBorder"
      px="md"
      py="lg"
      rounded="3xl"
    >
      <CardHeader pt="0">
        <Heading.h3
          color={{ base: "primary", md: "white" }}
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight={{ base: "semibold", md: "medium" }}
          textAlign="center"
        >
          {title}
        </Heading.h3>
      </CardHeader>
      <CardBody p="0">
        <Text fontSize={{ base: "sm", md: "md" }} textAlign="center">
          {description}
        </Text>
      </CardBody>
    </Card>
  )
}

AboutUsCard.displayName = "AboutUsCard"
