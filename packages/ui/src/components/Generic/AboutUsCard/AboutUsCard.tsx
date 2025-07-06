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
 * @param props - AboutUsCard component properties
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
      bg={["secondary.50", "secondary.800"]}
      borderColor="linear-gradient(35deg, rgba(255, 255, 255, 0.50) 89.19%), rgba(255, 255, 255, 0.07)"
      borderWidth="1px"
      gap="md"
      justifyContent="center"
      px="md"
      py="lg"
      rounded="3xl"
    >
      <CardHeader pt="0">
        <Heading.h3 color="primary" fontSize="2xl" fontWeight="semibold" textAlign="center">
          {title}
        </Heading.h3>
      </CardHeader>
      <CardBody p="0">
        <Text fontSize="sm" textAlign="center">
          {description}
        </Text>
      </CardBody>
    </Card>
  )
}

AboutUsCard.displayName = "AboutUsCard"
