import type { PlayLevel } from "@/types/types"
import { Button } from "@yamada-ui/react"
interface LevelSelectorButtonProps {
  name?: PlayLevel
  selected: boolean
  handleClick: () => void
}

export const LevelSelectorButton = ({ name, selected, handleClick }: LevelSelectorButtonProps) => (
  <Button
    colorScheme="primary"
    fontSize="sm"
    fontWeight="medium"
    height={12}
    onClick={handleClick}
    variant={selected ? "solid" : "ghost"}
    wordBreak="break-word"
  >
    {name}
  </Button>
)
