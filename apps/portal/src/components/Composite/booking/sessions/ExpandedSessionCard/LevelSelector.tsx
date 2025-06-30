import { Option, SegmentedControl, SegmentedControlButton, Select } from "@yamada-ui/react"
import { useCartStore } from "@/stores/useCartStore"
import { PlayLevel } from "@/types/types"

interface LevelSelectorProps {
  id: number
  selectedLevel?: PlayLevel
}

export const LevelSelector = ({ id, selectedLevel }: LevelSelectorProps) => {
  const updatePlayLevelById = useCartStore((state) => state.updatePlayLevelById)

  return (
    <>
      <SegmentedControl
        colorScheme="primary"
        defaultValue={selectedLevel}
        display={{ base: "none", md: "flex" }}
        onChange={(value) => updatePlayLevelById(id, value as PlayLevel)}
        roundedTop="none"
        width="full"
      >
        {Object.values(PlayLevel).map((playLevel) => (
          <SegmentedControlButton key={playLevel} textTransform="capitalize" value={playLevel}>
            {playLevel}
          </SegmentedControlButton>
        ))}
      </SegmentedControl>
      <Select
        colorScheme="primary"
        defaultValue={selectedLevel}
        display={{ md: "none" }}
        onChange={(value) => updatePlayLevelById(id, value as PlayLevel)}
        roundedTop="none"
        textTransform="capitalize"
      >
        {Object.values(PlayLevel).map((playLevel) => (
          <Option key={playLevel} textTransform="capitalize" value={playLevel}>
            {playLevel}
          </Option>
        ))}
      </Select>
    </>
  )
}
