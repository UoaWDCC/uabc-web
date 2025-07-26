"use client"

import { MAX_CASUAL_BOOKINGS, MAX_MEMBER_BOOKINGS, MembershipType } from "@repo/shared"
import { BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  IconButton,
} from "@yamada-ui/react"
import { memo } from "react"
import { Controller, useForm } from "react-hook-form"

export interface SessionItem {
  label: string
  memberAttendees: string
  casualAttendees: string
  value: string
  addon: string
  description: string
  disabled?: boolean
}

export interface SelectACourtFormData {
  /**
   * The selected session values.
   * - For members: array of session IDs (up to 2)
   * - For casual: single session ID or undefined
   */
  bookingTimes: string[]
}

export interface SelectACourtProps {
  membershipType?: MembershipType
  onSelect?: (value: string | string[] | undefined) => void
  sessions?: SessionItem[]
  title?: string
  onBack?: () => void

  /**
   * Callback function triggered when the next button is clicked.
   * Used for navigation to the next step in multi-step forms.
   *
   * @param data - The form data including selected sessions
   */
  onNext?: (data: { bookingTimes: string | string[] | undefined }) => void
}

export const SelectACourt = memo<SelectACourtProps>(
  ({ membershipType, onSelect, sessions = [], title = "Select a court", onBack, onNext }) => {
    const isMember =
      membershipType === MembershipType.member || membershipType === MembershipType.admin
    const maxBookings = isMember ? MAX_MEMBER_BOOKINGS : MAX_CASUAL_BOOKINGS

    const { control, handleSubmit } = useForm<SelectACourtFormData>({
      defaultValues: { bookingTimes: [] },
    })
    const onSubmit = (data: SelectACourtFormData) => {
      const external = isMember ? data.bookingTimes : (data.bookingTimes[0] ?? undefined)
      onNext?.({ bookingTimes: external })
    }

    return (
      <Card
        alignItems="center"
        as="form"
        backdropBlur="15px"
        backdropFilter="auto"
        bg={["secondary.50", "secondary.800"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
        onSubmit={handleSubmit(onSubmit)}
        px={{ base: "md", md: "xl" }}
        py="lg"
        rounded="3xl"
      >
        <CardHeader pt="0" w="full">
          <HStack alignItems="center" display="grid" gridTemplateColumns="1fr auto 1fr" w="full">
            <IconButton
              aria-label="Back"
              icon={<ArrowLeftIcon />}
              justifySelf="start"
              onClick={onBack}
              size="lg"
              variant="ghost"
            />

            <Heading.h2
              color={{ base: "primary", md: "white" }}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight={{ base: "semibold", md: "medium" }}
              textAlign="center"
            >
              {title}
            </Heading.h2>
            <Controller
              control={control}
              name="bookingTimes"
              render={({ field }) => (
                <IconWithText
                  icon={<ShuttleIcon />}
                  justifySelf="end"
                  label={`Sessions Left: ${maxBookings - field.value.length}`}
                />
              )}
            />
          </HStack>
        </CardHeader>
        <CardBody p="0" w="full">
          <Controller
            control={control}
            name="bookingTimes"
            render={({ field }) => {
              const selected: string[] = field.value || []
              const capReached = selected.length >= maxBookings

              const processed = sessions.map((s) => {
                const isSelected = selected.includes(s.value)
                return {
                  ...s,
                  memberAttendees: isMember ? s.memberAttendees : undefined,
                  casualAttendees: isMember ? s.casualAttendees : undefined,
                  disabled: s.disabled || (capReached && !isSelected), // applies to both variants
                }
              })

              const handleChange = (next: string[]) => {
                if (isMember) {
                  if (next.length > maxBookings) return
                  field.onChange(next)
                  onSelect?.(next.length ? next : undefined)
                } else {
                  // casual: toggle behavior
                  const last = next[next.length - 1]
                  const newArray = selected[0] === last ? [] : [last]
                  field.onChange(newArray)
                  onSelect?.(newArray[0] ?? undefined)
                }
              }

              return (
                <BookingTimesCardGroup
                  control={control}
                  display="grid"
                  gap={{ base: "sm", md: "md" }}
                  gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  items={processed} // Use the computed sessions from useMemo
                  name="bookingTimes"
                  onChange={handleChange}
                />
              )
            }}
          />
        </CardBody>
        <CardFooter>
          <Center mt="md" py="md" w="full">
            <Controller
              control={control}
              name="bookingTimes"
              render={({ field }) => (
                <Button
                  colorScheme="primary"
                  disabled={field.value?.length === 0}
                  endIcon={<ArrowRightIcon />}
                  size="lg"
                  type="submit"
                >
                  Next
                </Button>
              )}
            />
          </Center>
        </CardFooter>
      </Card>
    )
  },
)

SelectACourt.displayName = "SelectACourt"
