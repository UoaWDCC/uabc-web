import { Card, CardBody, CardHeader, Skeleton, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { Heading } from "../../Primitive"

export const AdditionalInfoSkeleton: FC = () => {
  return (
    <Card
      bg={["secondary.50", "secondary.900"]}
      layerStyle="gradientBorder"
      rounded="2xl"
      size="lg"
      w="min(4xl, 100%)"
    >
      <CardHeader>
        <Skeleton borderRadius="md" height="32px" mb="md" width="180px">
          <Heading.h2 py="4">Additional Info</Heading.h2>
        </Skeleton>
      </CardHeader>
      <CardBody>
        <VStack gap="md">
          {[1, 2, 3].map((i) => (
            <Skeleton borderRadius="md" height="48px" key={i} w="full" />
          ))}
        </VStack>
      </CardBody>
    </Card>
  )
}
