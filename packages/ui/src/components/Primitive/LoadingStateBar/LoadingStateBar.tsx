import { Progress, type ProgressProps } from "@yamada-ui/react"
import { forwardRef, memo } from "react"

/**
 * Props for the LoadingStateBar component
 */
export interface LoadingStateBarProps extends ProgressProps {
  /**
   * Whether the loading bar is disabled
   * When true, displays a dark overlay on the progress bar
   */
  disabled?: boolean
}

/**
 * Loading State Bar component based on Yamada UI Progress
 *
 * A progress bar component that shows loading progress with an optional disabled state.
 * When disabled, it displays a semi-transparent overlay to indicate the loading is paused.
 *
 * @param props - Combined Yamada UI Progress props and LoadingStateBar options
 * @returns A memoized progress bar component
 *
 * @example
 * // Basic loading bar with 50% progress
 * <LoadingStateBar value={50} />
 *
 * @example
 * // Disabled loading bar
 * <LoadingStateBar value={30} disabled />
 *
 * @example
 * // With custom color and size
 * <LoadingStateBar value={75} colorScheme="primary" size="lg" />
 *
 * @example
 * // Indeterminate loading (no value)
 * <LoadingStateBar isAnimation />
 */
export const LoadingStateBar = memo(
  forwardRef<HTMLDivElement, LoadingStateBarProps>(({ disabled = false, ...props }, ref) => {
    return (
      <Progress
        _disabled={{
          _before: {
            bg: "blackAlpha.500",
            w: "100%",
            h: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          },
        }}
        aria-disabled={disabled}
        ref={ref}
        rounded="full"
        {...props}
      />
    )
  }),
)

LoadingStateBar.displayName = "LoadingStateBar"
