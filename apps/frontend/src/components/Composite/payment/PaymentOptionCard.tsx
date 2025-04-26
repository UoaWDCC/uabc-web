import { Card, CardBody, HStack, Spacer, Text } from "@yamada-ui/react"
import { ArrowRightIcon } from "../Icons"

interface PaymentOptionCardProps {
  title: string
  subtitle: string
  onClick: () => void
}

export const PaymentOptionCard = ({ onClick, title, subtitle }: PaymentOptionCardProps) => {
  return (
    <Card bg="gray.50" color={["black", "white"]} onClick={onClick} variant="solid">
      <CardBody gap="0" pt="10" px="lg">
        <Text fontSize="xl" fontWeight="medium">
          {title}
        </Text>
        <HStack w="full">
          <Text color="tertiary" fontWeight="medium">
            {subtitle}
          </Text>
          <Spacer />
          <ArrowRightIcon h="8" w="8" />
        </HStack>
      </CardBody>
    </Card>
  )
}
