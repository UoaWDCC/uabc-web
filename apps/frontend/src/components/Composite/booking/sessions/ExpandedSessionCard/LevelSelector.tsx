import { Drawer, DrawerContent, DrawerTrigger } from "@/components/Generic/ui/drawer"
import { useCartStore } from "@/stores/useCartStore"
import { PlayLevel } from "@/types/types"
import { LevelSelectorButton } from "./LevelSelectorButton"

interface LevelSelectorProps {
  id: number
  selectedLevel?: PlayLevel
}

export const LevelSelector = ({ id, selectedLevel }: LevelSelectorProps) => {
  const updatePlayLevelById = useCartStore((state) => state.updatePlayLevelById)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className="h-12 w-full rounded-b-md bg-tertiary font-semibold text-sm text-tertiary-foreground capitalize"
          type="button"
        >
          {selectedLevel ?? "Select Play Level"}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mb-4 text-center font-medium">Please select a play level</div>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-white p-2">
          {Object.values(PlayLevel).map((playLevel) => (
            <LevelSelectorButton
              handleClick={() => updatePlayLevelById(id, playLevel)}
              key={playLevel}
              name={playLevel}
              selected={selectedLevel === playLevel}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
