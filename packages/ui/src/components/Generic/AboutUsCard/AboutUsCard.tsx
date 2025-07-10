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
      backdropBlur="15px"
      backdropFilter="auto"
      bg={["secondary.50", "secondary.800"]}
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
