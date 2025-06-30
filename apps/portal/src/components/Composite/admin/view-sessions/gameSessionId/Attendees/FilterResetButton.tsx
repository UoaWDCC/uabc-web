import { XIcon } from "@yamada-ui/lucide"
import { assignRef, Button, useBoolean } from "@yamada-ui/react"
import { type FC, memo } from "react"

interface FilterResetButtonProps {
  resetRef: React.RefObject<() => void>
  showResetRef: React.RefObject<(value: boolean) => void>
}

export const FilterResetButton: FC<FilterResetButtonProps> = memo(({ resetRef, showResetRef }) => {
  const [isShow, { off, on }] = useBoolean()
  assignRef(showResetRef, (hasValue) => {
    if (hasValue) {
      on()
    } else {
      off()
    }
  })
  if (!isShow) return null
  return (
    <Button
      endIcon={<XIcon />}
      onClick={() => {
        resetRef.current()
      }}
      variant="ghost"
    >
      Reset
    </Button>
  )
})

FilterResetButton.displayName = "FilterResetButton"
