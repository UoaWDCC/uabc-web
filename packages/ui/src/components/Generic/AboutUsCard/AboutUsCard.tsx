import { Heading } from "@repo/ui/components/Primitive"
import { Card, CardBody, CardHeader, Text } from "@yamada-ui/react"

export interface AboutUsCardProps {
  title: string
  description: string
}

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
        <Heading.h3 fontSize="2xl" fontWeight="semibold" textAlign="center" textColor="primary">
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
