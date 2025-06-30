import {
  Card,
  CardBody,
  type CardProps,
  Center,
  FormatNumber,
  Text,
  VStack,
} from "@yamada-ui/react"

interface PaymentInfoCardProps extends CardProps {
  amount: number
}

export const PaymentInfoCard = ({ amount, ...props }: PaymentInfoCardProps) => {
  return (
    <Card bg="primary" py="8" variant="solid" {...props}>
      <CardBody>
        <Center as={VStack}>
          <Text color="transparentize(#FAFAFAB2, 70%)" fontSize="xs">
            Your total for this session:
          </Text>
          <Text className="mb-5 font-bold text-3xl" fontSize="3xl" fontWeight="bold">
            <FormatNumber currency="NZD" style="currency" value={amount} />
          </Text>
          <Text color="#FAFAFAB2" fontSize="xs">
            Casual Badminton Session
          </Text>
        </Center>
      </CardBody>
    </Card>
  )
}
