import type { PlayLevel } from "@/types/types"
import { SegmentedControlButton } from "@yamada-ui/react"
interface LevelSelectorButtonProps {
  name?: PlayLevel
  handleClick: () => void
}

export const LevelSelectorButton = ({ name, handleClick }: LevelSelectorButtonProps) => (
  <SegmentedControlButton
    fontSize="sm"
    fontWeight="medium"
    height={12}
    onClick={handleClick}
    textTransform="capitalize"
    value={name ?? ""}
    wordBreak="break-word"
  >
    {name}
  </SegmentedControlButton>
)
