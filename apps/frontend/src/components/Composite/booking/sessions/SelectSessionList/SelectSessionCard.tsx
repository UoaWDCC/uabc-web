import { memo } from "react"

import { CircleCheckIcon } from "@yamada-ui/lucide"
import { Card, CardBody, CardHeader, HStack, Spacer, Text, VStack } from "@yamada-ui/react"

type SelectSessionCardStatus = "default" | "selected" | "disabled"

interface SelectSessionCardProps {
  day: string
  startTime: string
  endTime: string
  location: string
  status: SelectSessionCardStatus
}

function UnmemoizedSelectSessionCard({
  day,
  startTime,
  endTime,
  status,
  location,
}: SelectSessionCardProps) {
  const isSelected = status === "selected"
  const isDisabled = status === "disabled"
  return (
    <Card variant={isSelected ? "solid" : "subtle"}>
      <CardHeader>
        <Text fontSize="lg" fontWeight="medium">
          {day} {isDisabled && "(Session Full)"}
        </Text>
      </CardHeader>
      <CardBody as={HStack}>
        <HStack width="full">
          <VStack gap={1}>
            <Text>{location}</Text>
            <Text textTransform="uppercase">
              {startTime} - {endTime}
            </Text>
          </VStack>
          {isSelected && (
            <>
              <Spacer />
              <CircleCheckIcon boxSize={30} />
            </>
          )}
        </HStack>
      </CardBody>
    </Card>
  )
}

export const SelectSessionCard = memo(UnmemoizedSelectSessionCard)
