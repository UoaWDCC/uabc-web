import { Card, CardBody, HStack, Spacer, Text } from '@yamada-ui/react'
import { ArrowRightIcon } from '../Icons'

interface PaymentOptionCardProps {
  title: string
  subtitle: string
  onClick: () => void
}

export const PaymentOptionCard = ({ onClick, title, subtitle }: PaymentOptionCardProps) => {
  return (
    <Card onClick={onClick} variant="solid" bg="gray.50" color={['black', 'white']}>
      <CardBody gap="0" pt="10" px="lg">
        <Text fontSize="xl" fontWeight="medium">
          {title}
        </Text>
        <HStack w="full">
          <Text fontWeight="medium" color="tertiary">
            {subtitle}
          </Text>
          <Spacer />
          <ArrowRightIcon h="8" w="8" />
        </HStack>
      </CardBody>
    </Card>
  )
}
