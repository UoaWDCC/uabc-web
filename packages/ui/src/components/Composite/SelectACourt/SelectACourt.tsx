"use client"

import type { MembershipType } from "@repo/shared"
import { BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import { Card, CardBody, CardHeader, Center, HStack, IconButton } from "@yamada-ui/react"
import { memo, useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"

type Variant = MembershipType.member | MembershipType.casual

interface SessionItem {
  label: string
  memberAttendees: string
  casualAttendees: string
  value: string
  addon: string
  description: string
  disabled?: boolean
}

interface SelectACourtFormData {
  /**
   * The selected session values.
   * - For members: array of session IDs (up to 2)
   * - For casual: single session ID or undefined
   */
  bookingTimes: string | string[]
}

export interface SelectACourtProps {
  variant?: Variant
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
  onNext?: (data: SelectACourtFormData) => void
}

export const SelectACourt = memo<SelectACourtProps>(
  ({ variant = "member", onSelect, sessions = [], title = "Select a court", onBack, onNext }) => {
    const isMember = variant === "member"
    const max = isMember ? 2 : 1

    const {
      control,
      setValue,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm({
      defaultValues: {
        bookingTimes: isMember ? [] : "",
      },
    })

    const watched = useWatch({ control, name: "bookingTimes" })

    const selectionArray: string[] = isMember
      ? (watched as string[])
      : watched
        ? [watched as string]
        : []

    useEffect(() => {
      if (isMember && watched.length > max) {
        setValue("bookingTimes", watched.slice(0, max), { shouldDirty: true })
      }
    }, [watched, isMember, max, setValue])

    useEffect(() => {
      onSelect?.(selectionArray)
    }, [selectionArray, onSelect])

    const processedSessions = useMemo(
      () =>
        sessions.map((s) => {
          const selected = selectionArray.includes(s.value)
          const capReached = selectionArray.length >= max
          return {
            ...s,
            memberAttendees: isMember ? s.memberAttendees : undefined,
            casualAttendees: isMember ? s.casualAttendees : undefined,
            disabled: s.disabled || (isMember ? capReached && !selected : !!watched && !selected),
          }
        }),
      [sessions, selectionArray, max, isMember, watched],
    )

    const handleNext = (data: SelectACourtFormData) => {
      if (onNext) {
        onNext(data)
      } else {
        console.log("Next step with data:", data)
      }
    }

    return (
      <Card
        alignItems="center"
        backdropBlur="15px"
        backdropFilter="auto"
        bg={["secondary.50", "secondary.800"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
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

            <IconWithText
              icon={<ShuttleIcon />}
              justifySelf="end"
              label={`Sessions Left: ${max - selectionArray.length}`}
            />
          </HStack>
        </CardHeader>
        <CardBody p="0" w="full">
          <form onSubmit={handleSubmit(handleNext)} style={{ width: "100%" }}>
            <BookingTimesCardGroup
              control={control}
              display="grid"
              gap={{ base: "sm", md: "md" }}
              gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
              items={processedSessions} // Use the computed sessions from useMemo
              name="bookingTimes"
            />
            <Center mt="md" py="md" w="full">
              <Button
                colorScheme="primary"
                endIcon={<ArrowRightIcon />}
                isDisabled={selectionArray.length === 0}
                isLoading={isSubmitting}
                size="lg"
                type="submit"
              >
                Next
              </Button>
            </Center>
          </form>
        </CardBody>
      </Card>
    )
  },
)

SelectACourt.displayName = "SelectACourt"
