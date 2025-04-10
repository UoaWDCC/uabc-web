import { XIcon } from '@yamada-ui/lucide'
import { assignRef, Button, useBoolean } from '@yamada-ui/react'
import { FC, memo } from 'react'

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
      variant="ghost"
      endIcon={<XIcon />}
      onClick={() => {
        resetRef.current()
      }}
    >
      Reset
    </Button>
  )
})

FilterResetButton.displayName = 'FilterResetButton'
