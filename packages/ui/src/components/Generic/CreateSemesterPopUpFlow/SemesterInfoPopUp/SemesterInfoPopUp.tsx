"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SemesterInfoPopUpSchema, type SemesterInfoPopUpValues, Weekday } from "@repo/shared"
import { Button, Heading, Select, TextInput } from "@repo/ui/components/Primitive"
import { InputType } from "@repo/ui/components/Primitive/TextInput/types"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  type FC,
  FormControl,
  memo,
  noop,
  Option,
  VStack,
} from "@yamada-ui/react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

export interface SemesterInfoPopUpProps {
  /**
   * Default values to pre-fill the form.
   */
  defaultValues?: Partial<SemesterInfoPopUpValues>
  /**
   * Whether the popup is open or not.
   * @default false
   */
  open: boolean
  /**
   * Submit handler called when user submits the form.
   */
  onNext?: SubmitHandler<SemesterInfoPopUpValues>
  /**
   * Handler called when the user clicks the back button.
   */
  onBack?: () => void
  /**
   * Handler called when the user clicks the cancel button or closes the dialog.
   */
  onClose?: () => void
}

const WEEKDAY_LABELS: Record<Weekday, string> = {
  [Weekday.sunday]: "Sunday",
  [Weekday.monday]: "Monday",
  [Weekday.tuesday]: "Tuesday",
  [Weekday.wednesday]: "Wednesday",
  [Weekday.thursday]: "Thursday",
  [Weekday.friday]: "Friday",
  [Weekday.saturday]: "Saturday",
}

/**
 * A popup dialog component for entering semester information, including the booking open day and time.
 * It uses a form with validation to collect user input and provides navigation buttons for back, next, and close actions.
 *
 * @param props The props for the SemesterInfoPopUp component.
 * @returns The rendered SemesterInfoPopUp component.
 */
export const SemesterInfoPopUp: FC<SemesterInfoPopUpProps> = memo(
  ({ defaultValues, open, onNext, onBack, onClose }) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
    } = useForm<SemesterInfoPopUpValues>({
      resolver: zodResolver(SemesterInfoPopUpSchema),
      defaultValues: {
        bookingOpenDay: defaultValues?.bookingOpenDay,
        bookingOpenTime: defaultValues?.bookingOpenTime ?? "",
      },
    })

    return (
      <Dialog
        borderRadius="3xl"
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap={{ base: "md", md: "lg" }}
        layerStyle="gradientBorder"
        maxW={{ base: "90%", md: "675px" }}
        onClose={onClose}
        open={open}
        p="lg"
      >
        <DialogCloseButton
          bg="black"
          borderRadius="full"
          layerStyle="gradientBorder"
          right="md"
          size="md"
          top="md"
        />
        <VStack as="form" h="full" justifyContent="center" onSubmit={handleSubmit(onNext ?? noop)}>
          <DialogHeader justifyContent="center" w="full">
            <Heading.h2 fontSize="5xl" fontWeight="semibold" textAlign="center">
              Create New Semester
            </Heading.h2>
          </DialogHeader>
          <DialogBody justifyContent="center" overflow="visible" px={{ base: "10%", md: "15%" }}>
            <VStack align="center" gap="lg">
              <FormControl
                errorMessage={errors.bookingOpenDay?.message}
                invalid={!!errors.bookingOpenDay}
                label="Booking Open Day"
              >
                <Controller
                  control={control}
                  name="bookingOpenDay"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={field.onChange}
                      placeholder="Select a day"
                      size="lg"
                    >
                      {Object.values(Weekday).map((day) => (
                        <Option key={day} value={day}>
                          {WEEKDAY_LABELS[day]}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl
                errorMessage={errors.bookingOpenTime?.message}
                invalid={!!errors.bookingOpenTime}
                label="Booking Open Time"
              >
                <TextInput size="lg" type={InputType.Time} {...register("bookingOpenTime")} />
              </FormControl>
            </VStack>
          </DialogBody>
          <DialogFooter justifyContent="center" w="full">
            <ButtonGroup flexDirection={{ base: "column-reverse", md: "row" }} gap="md">
              <Button colorScheme="secondary" gap="0" onClick={onBack} size="lg">
                <ArrowLeftIcon />
                Back
              </Button>
              <Button colorScheme="primary" gap="0" loading={isSubmitting} size="lg" type="submit">
                Next
                <ArrowRightIcon />
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </VStack>
      </Dialog>
    )
  },
)

SemesterInfoPopUp.displayName = "SemesterInfoPopUp"
