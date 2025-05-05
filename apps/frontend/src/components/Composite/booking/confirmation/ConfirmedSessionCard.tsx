import { Card, CardBody, CardHeader } from "@yamada-ui/react"

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
      <CardHeader fontSize="large" fontWeight="medium">
        {weekDay}
      </CardHeader>
      <CardBody color="whiteAlpha.700" fontSize="small">
        {startTime} - {endTime}
        <br />
        {locationName}
        <br />
        {address}
      </CardBody>
    </Card>
  )
}
