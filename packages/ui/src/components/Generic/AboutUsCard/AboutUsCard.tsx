import { Text, VStack } from "@yamada-ui/react"
import { Heading } from "@/components/Primitive"

export interface AboutUsCardProps {
  title: string
  description: string
}

export const AboutUsCard = ({ title, description }: AboutUsCardProps) => {
  return (
    <VStack>
      <Heading.h3 fontSize="2xl">{title}</Heading.h3>
      <Text fontSize="sm">{description}</Text>
    </VStack>
  )
}
