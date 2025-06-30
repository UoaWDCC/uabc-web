import { Progress, type ProgressProps } from "@yamada-ui/react"
import { forwardRef, memo } from "react"

export interface LoadingStateBarProps extends ProgressProps {
  /**
   * Whether the loading bar is disabled
   */
  disabled?: boolean
}

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
