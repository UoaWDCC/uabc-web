import { useCartStore } from "@/stores/useCartStore"
import { PlayLevel } from "@/types/types"
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@yamada-ui/react"
import { LevelSelectorButton } from "./LevelSelectorButton"

interface LevelSelectorProps {
  id: number
  selectedLevel?: PlayLevel
}

export const LevelSelector = ({ id, selectedLevel }: LevelSelectorProps) => {
  const updatePlayLevelById = useCartStore((state) => state.updatePlayLevelById)
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        colorScheme="neutral"
        fontSize="sm"
        fontWeight="semibold"
        height={12}
        onClick={onOpen}
        textTransform="capitalize"
        variant="ghost"
      >
        {selectedLevel ?? "Select Play Level"}
      </Button>
      <Drawer onClose={onClose} open={open} placement="bottom" size="2xl">
        <DrawerHeader>
          <Text fontWeight="medium" textAlign="center">
            Please select a play level
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <SimpleGrid columns={3} width="full">
            {Object.values(PlayLevel).map((playLevel) => (
              <LevelSelectorButton
                handleClick={() => updatePlayLevelById(id, playLevel)}
                key={playLevel}
                name={playLevel}
                selected={selectedLevel === playLevel}
              />
            ))}
          </SimpleGrid>
        </DrawerBody>
      </Drawer>
    </>
  )
}
