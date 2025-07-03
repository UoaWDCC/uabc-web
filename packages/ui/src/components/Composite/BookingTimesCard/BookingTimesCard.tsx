import { Clock10Icon, MapPinIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardHeader,
  type CardProps,
  Float,
  HStack,
  Separator,
  Spacer,
  Text,
} from "@yamada-ui/react"
import { useMemo } from "react"
import { Button, Heading } from "../../Primitive"
import { separatorAfterStyles, styles } from "./BookingTimesCard.style"

export interface BookingTimesCardProps {
  title: string
  bookingTime: string
  location: string
  type?: keyof typeof styles
}

export const BookingTimesCard = ({
  title,
  bookingTime,
  location,
  type = "default",
}: BookingTimesCardProps) => {
  const cardStyles: CardProps = useMemo(
    () => ({
      ...(styles[type as keyof typeof styles] ?? {}),
    }),
    [type],
  )
  const isDisabled = type === "full"

  return (
    <Card
      alignItems="center"
      dropShadow="drop-shadow(0px 0px 20px rgba(105, 105, 105, 0.50))"
      gap="md"
      justifyContent="center"
      minWidth="md"
      p="lg"
      position="relative"
      rounded="2xl"
      {...cardStyles}
    >
      <CardHeader p="0">
        <Heading.h3 fontSize="xl" fontWeight="semibold" textAlign="left">
          {title}
        </Heading.h3>
        <Spacer />
        <HStack gap="sm">
          <Clock10Icon />
          <Text>{bookingTime}</Text>
        </HStack>
      </CardHeader>
      <Separator _after={separatorAfterStyles} position="relative" />
      <CardBody alignSelf="flex-start" p="0" width="full">
        <HStack>
          <MapPinIcon height="24px" width="24px" />
          <Text fontSize="sm">{location}</Text>
        </HStack>
        <Separator _after={separatorAfterStyles} borderColor="transparent" position="relative" />
      </CardBody>
      <Float placement="end-center">
        <Button
          bgGradient={
            type === "selected"
              ? "radial-gradient(1120.78% 150.46% at 123.73% 123.3%, #282828 0%, #27164E 100%)"
              : undefined
          }
          colorScheme="primary"
          disabled={isDisabled}
          fontWeight="normal"
          opacity={"1"}
          size="sm"
          variant={type === "selected" ? "gradient" : "solid"}
        >
          {type === "selected" ? "Unselect" : type === "full" ? "Full" : "Select"}
        </Button>
      </Float>
    </Card>
  )
}
