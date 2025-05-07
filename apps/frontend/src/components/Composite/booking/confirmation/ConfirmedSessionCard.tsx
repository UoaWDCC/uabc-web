import { Card, CardBody, CardHeader, Heading, Text } from "@yamada-ui/react"

type ConfirmedSessionCardProps = {
  weekDay: string
  locationName: string
  address: string
  startTime: string
  endTime: string
}

export const ConfirmedSessionCard = ({
  weekDay,
  locationName,
  address,
  startTime,
  endTime,
}: ConfirmedSessionCardProps) => {
  return (
    <Card variant="solid">
      <CardHeader>
        <Heading as="h3" fontSize="lg" fontWeight="medium">
          {weekDay}
        </Heading>
      </CardHeader>
      <CardBody color="whiteAlpha.800" fontSize="sm" gap="sm">
        <Text>
          {startTime} - {endTime}
        </Text>
        <Text>{locationName}</Text>
        <Text>{address}</Text>
      </CardBody>
    </Card>
  )
}
