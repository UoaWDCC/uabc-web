import {
  Card,
  CardBody,
  type CardProps,
  Center,
  FormatNumber,
  Text,
  VStack,
} from '@yamada-ui/react'

interface PaymentInfoCardProps extends CardProps {
  amount: number
}

export const PaymentInfoCard = ({ amount, ...props }: PaymentInfoCardProps) => {
  return (
    <Card variant="solid" bg="primary" py="8" {...props}>
      <CardBody>
        <Center as={VStack}>
          <Text fontSize="xs" color="transparentize(#FAFAFAB2, 70%)">
            Your total for this session:
          </Text>
          <Text fontSize="3xl" fontWeight="bold" className="mb-5 text-3xl font-bold">
            <FormatNumber value={amount} style="currency" currency="NZD" />
          </Text>
          <Text fontSize="xs" color="#FAFAFAB2">
            Casual Badminton Session
          </Text>
        </Center>
      </CardBody>
    </Card>
  )
}
