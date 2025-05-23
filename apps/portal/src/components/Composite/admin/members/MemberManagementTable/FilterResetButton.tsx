import { XIcon } from "@yamada-ui/lucide"
import { Button, assignRef, useBoolean } from "@yamada-ui/react"
import { type FC, type RefObject, memo, useCallback, useRef } from "react"

interface FilterResetButtonProps {
  hasFilterRef: RefObject<(hasValue: boolean) => void>
  resetFilterRef: RefObject<() => void>
}

export const FilterResetButton: FC<FilterResetButtonProps> = memo(
  ({ hasFilterRef, resetFilterRef }) => {
    const [isShow, { off, on }] = useBoolean()
    const prevHasFilterRef = useRef<boolean>(false)

    const onReset = useCallback(() => {
      resetFilterRef.current()
    }, [resetFilterRef])

    assignRef(hasFilterRef, (hasValue) => {
      prevHasFilterRef.current = hasValue

      if (hasValue) {
        on()
      } else {
        off()
      }
    })

    if (!isShow) return null
    return (
      <Button endIcon={<XIcon />} onClick={onReset} variant="ghost">
        Reset
      </Button>
    )
  },
)

FilterResetButton.displayName = "FilterResetButton"
