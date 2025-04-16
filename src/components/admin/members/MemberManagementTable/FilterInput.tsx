import { assignRef, Input } from '@yamada-ui/react'
import { type FC, memo, type RefObject, useRef } from 'react'

interface FilterInputProps {
  passHasRef: RefObject<(hasValue: boolean) => void>
  passValueRef: RefObject<(value: string) => void>
  resetRef: RefObject<() => void>
}

export const FilterInput: FC<FilterInputProps> = memo(({ passHasRef, passValueRef, resetRef }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  assignRef(resetRef, () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    setTimeout(() => {
      // Trigger parent component's filter with empty string to show all items
      passValueRef.current('')
      passHasRef.current(false)
    })
  })
  return (
    <Input
      ref={inputRef}
      placeholder="Filter members..."
      onChange={(ev) => {
        setTimeout(() => {
          passValueRef.current(ev.target.value)
          passHasRef.current(!!ev.target.value)
        })
      }}
      w="300px"
    />
  )
})

FilterInput.displayName = 'FilterInput'
