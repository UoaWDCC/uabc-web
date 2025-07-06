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
import { memo, useMemo } from "react"
import { Button, Heading } from "../../Primitive"
import { separatorAfterStyles, styles } from "./BookingTimesCard.style"

/**
 * Props for the {@link BookingTimesCard} component.
 */
export interface BookingTimesCardProps {
  /**
   * The title for the BookingTimesCard
   * @example "Tuesday, 12th May"
   */
  title: string
  /**
   * The time for the booking
   * @example "7:30 - 10pm"
   */
  bookingTime: string
  /**
   * The location for the booking
   * @example "UoA Hiwa Center"
   */
  location: string
  /**
   * The type of the BookingTimesCard
   * @example "default"
   */
  type?: keyof typeof styles
}

/**
 * The BookingTimesCard component displays a card with a title, booking time, and location.
 *
 * @param props Props for the BookingTimesCard component.
 * @returns A memoized BookingTimesCard component.
 *
 * @example
 * // Default usage
 * <BookingTimesCard
 *   title="Tuesday, 12th May"
 *   bookingTime="7:30 - 10pm"
 *   location="UoA Hiwa Center"
 * />
 *
 * @example
 * // Selected type
 * <BookingTimesCard
 *   title="Wednesday, 13th May"
 *   bookingTime="8:00 - 11pm"
 *   location="UoA Hiwa Center"
 *   type="selected"
 * />
 *
 * @example
 * // Disabled/Full state
 * <BookingTimesCard
 *   title="Thursday, 14th May"
 *   bookingTime="9:00 - 12pm"
 *   location="UoA Hiwa Center"
 *   type="full"
 * />
 */
export const BookingTimesCard = memo(
  ({ title, bookingTime, location, type = "default" }: BookingTimesCardProps) => {
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
            size="sm"
            variant={type === "selected" ? "gradient" : "solid"}
          >
            {type === "selected" ? "Unselect" : type === "full" ? "Full" : "Select"}
          </Button>
        </Float>
      </Card>
    )
  },
)

BookingTimesCard.displayName = "BookingTimesCard"
