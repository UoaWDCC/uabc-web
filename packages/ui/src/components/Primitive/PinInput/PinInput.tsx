"use client"

import { PinInput as UIPinInput, type PinInputProps as UIPinInputProps } from "@yamada-ui/react"
import { forwardRef, memo } from "react"

/**
 * Props for {@link PinInput}
 *
 * @remarks
 * Extends all the props from {@link UIPinInputProps}.
 * Provides additional customization for pin input fields with automatic React Hook Form integration.
 *
 * @example
 * // Basic usage
 * <PinInput label="Verification Code" length={6} />
 *
 * @example
 * // With React Hook Form
 * <PinInput
 *   label="OTP Code"
 *   length={4}
 *   {...register("otp")}
 * />
 *
 * @example
 * // Manual error handling
 * <PinInput
 *   label="PIN"
 *   length={4}
 *   type={PinInputType.Number}
 * />
 */
export interface PinInputProps extends UIPinInputProps {}

/**
 * A pin input component.
 *
 * @param props - Pin input component properties
 * @returns A memoized, forwarded pin input component
 */
export const PinInput = memo(
  forwardRef<HTMLDivElement, PinInputProps>(({ ...props }: PinInputProps, ref) => {
    return <UIPinInput ref={ref} {...props} />
  }),
)

PinInput.displayName = "PinInput"
