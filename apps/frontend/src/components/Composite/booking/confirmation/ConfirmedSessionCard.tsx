import { Heading } from "@repo/ui/components/Heading"
import { Card, CardBody, CardHeader, Text } from "@yamada-ui/react"

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
        <Heading.h3>{weekDay}</Heading.h3>
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
