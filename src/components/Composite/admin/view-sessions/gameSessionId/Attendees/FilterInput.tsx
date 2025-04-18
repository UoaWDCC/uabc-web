import { assignRef, Input } from '@yamada-ui/react'
import { type FC, memo, useState } from 'react'

interface FilterInputProps {
  resetRef: React.RefObject<() => void>
  filterRef: React.RefObject<(value: string) => void>
  prevHasValueRef: React.RefObject<boolean>
  showResetRef: React.RefObject<(value: boolean) => void>
}

export const FilterInput: FC<FilterInputProps> = memo(
  ({ resetRef, filterRef, prevHasValueRef, showResetRef }) => {
    const [value, setValue] = useState<string>('')
    assignRef(resetRef, () => {
      setValue('')

      setTimeout(() => {
        // Trigger parent component's filter with empty string to show all items
        filterRef.current('')
      })
    })
    return (
      <Input
        placeholder="Filter members..."
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value)
          const hasValue = !!ev.target.value
          prevHasValueRef.current = hasValue
          if (hasValue) {
            showResetRef.current(true)
          } else {
            showResetRef.current(false)
          }

          setTimeout(() => {
            filterRef.current(ev.target.value)
          })
        }}
        w="300px"
      />
    )
  },
)

FilterInput.displayName = 'FilterInput'
