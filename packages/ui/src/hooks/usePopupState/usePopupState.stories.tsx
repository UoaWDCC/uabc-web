import { Button, TextInput } from "@repo/ui/components/Primitive"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Badge,
  Box,
  ButtonGroup,
  HStack,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@yamada-ui/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { useState } from "react"
import { usePopupState } from "./usePopupState"

interface UsePopupStateStoryProps {
  popupId: string
  openValue?: string
  valueKey?: string
  initialValue?: string
  multiple?: boolean
}

const UsePopupStateDemo = ({
  popupId,
  openValue,
  valueKey,
  initialValue = "",
  multiple = false,
}: UsePopupStateStoryProps) => {
  const parsedInitialValue = multiple
    ? (initialValue
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean) as string[])
    : initialValue

  const popup = usePopupState<typeof multiple>({
    popupId,
    openValue,
    valueKey,
    initialValue: parsedInitialValue,
    multiple,
    onValueChange: (value) => console.log("Value changed:", value),
    onOpen: () => console.log("Popup opened"),
    onClose: () => console.log("Popup closed"),
  })

  const [inputValue, setInputValue] = useState("")

  return (
    <VStack>
      <VStack>
        <Text fontSize="lg" fontWeight="bold">
          Popup State: {popupId}
        </Text>

        <HStack>
          <Badge colorScheme={popup.isOpen ? "green" : "gray"}>
            {popup.isOpen ? "Open" : "Closed"}
          </Badge>
          <Text>Current Value: {JSON.stringify(popup.value)}</Text>
        </HStack>

        <HStack>
          <Button colorScheme="blue" onClick={popup.open}>
            Open
          </Button>
          <Button colorScheme="red" onClick={popup.close}>
            Close
          </Button>
          <Button colorScheme="purple" onClick={popup.toggle}>
            Toggle
          </Button>
        </HStack>

        <HStack>
          <TextInput
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            size="sm"
            value={inputValue}
          />
          <Button
            colorScheme="green"
            onClick={() => {
              if (multiple) {
                popup.setValue(
                  inputValue
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                )
              } else {
                popup.setValue(inputValue)
              }
            }}
            size="sm"
          >
            Set Value
          </Button>
          <Button colorScheme="orange" onClick={popup.clearValue} size="sm">
            Clear
          </Button>
        </HStack>

        {multiple && (
          <Text color="muted" fontSize="sm">
            For array values, separate with commas (e.g., "item1, item2, item3")
          </Text>
        )}
      </VStack>
    </VStack>
  )
}

const MultiplePopupsDemo = () => {
  const popup1 = usePopupState({
    popupId: "popup1",
    initialValue: "",
    onValueChange: (value) => console.log("Popup1 value changed:", value),
  })

  const popup2 = usePopupState({
    popupId: "popup2",
    initialValue: "",
    onValueChange: (value) => console.log("Popup2 value changed:", value),
  })

  const popup3 = usePopupState({
    popupId: "popup3",
    initialValue: "",
    onValueChange: (value) => console.log("Popup3 value changed:", value),
  })

  return (
    <VStack>
      <Text fontSize="xl" fontWeight="bold">
        Multiple Popups Navigation Demo
      </Text>

      <HStack>
        <Box borderRadius="md" borderWidth={1} flex={1}>
          <VStack>
            <Text fontWeight="bold">Popup 1</Text>
            <Badge colorScheme={popup1.isOpen ? "green" : "gray"}>
              {popup1.isOpen ? "Open" : "Closed"}
            </Badge>
            <Text fontSize="sm">Value: {popup1.value}</Text>
          </VStack>
        </Box>

        <Box borderRadius="md" borderWidth={1} flex={1}>
          <VStack>
            <Text fontWeight="bold">Popup 2</Text>
            <Badge colorScheme={popup2.isOpen ? "green" : "gray"}>
              {popup2.isOpen ? "Open" : "Closed"}
            </Badge>
            <Text fontSize="sm">Value: {popup2.value}</Text>
          </VStack>
        </Box>

        <Box borderRadius="md" borderWidth={1} flex={1}>
          <VStack>
            <Text fontWeight="bold">Popup 3</Text>
            <Badge colorScheme={popup3.isOpen ? "green" : "gray"}>
              {popup3.isOpen ? "Open" : "Closed"}
            </Badge>
            <Text fontSize="sm">Value: {popup3.value}</Text>
          </VStack>
        </Box>
      </HStack>

      <VStack>
        <Text fontWeight="bold">Navigation Controls</Text>

        <ButtonGroup gap="md">
          <Button colorScheme="blue" onClick={() => popup1.open()} size="sm">
            Open Popup 1
          </Button>
          <Button colorScheme="blue" onClick={() => popup2.open()} size="sm">
            Open Popup 2
          </Button>
          <Button colorScheme="blue" onClick={() => popup3.open()} size="sm">
            Open Popup 3
          </Button>
        </ButtonGroup>

        <ButtonGroup gap="md">
          <Button colorScheme="red" onClick={() => popup1.close()} size="sm">
            Close Popup 1
          </Button>
          <Button colorScheme="red" onClick={() => popup2.close()} size="sm">
            Close Popup 2
          </Button>
          <Button colorScheme="red" onClick={() => popup3.close()} size="sm">
            Close Popup 3
          </Button>
        </ButtonGroup>

        <ButtonGroup gap="md">
          <Button
            colorScheme="purple"
            onClick={() => {
              popup1.close()
              popup2.open()
            }}
            size="sm"
          >
            Switch 1 → 2
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => {
              popup2.close()
              popup3.open()
            }}
            size="sm"
          >
            Switch 2 → 3
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => {
              popup3.close()
              popup1.open()
            }}
            size="sm"
          >
            Switch 3 → 1
          </Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  )
}

type Story = StoryObj<typeof UsePopupStateDemo>

const meta: Meta<typeof UsePopupStateDemo> = {
  component: UsePopupStateDemo,
  title: "Hooks / usePopupState",
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  argTypes: {
    popupId: {
      control: "text",
      description: "Unique identifier for the popup (used as query param key)",
    },
    openValue: {
      control: "text",
      description: "The value representing the open state in the query param",
    },
    valueKey: {
      control: "text",
      description: "The key for the value in the query params",
    },
    initialValue: {
      control: "text",
      description: "Initial value for the popup state",
    },
    multiple: {
      control: "boolean",
      description: "If true, the value is treated as an array (multi-value selection)",
    },
  },
}

export default meta

export const Basic: Story = {
  args: {
    popupId: "basic-popup",
    initialValue: "Hello World",
  },
}

export const CustomKeys: Story = {
  args: {
    popupId: "custom-popup",
    openValue: "active",
    valueKey: "custom-value",
    initialValue: "Custom initial value",
  },
}

export const ArrayMode: Story = {
  args: {
    popupId: "array-popup",
    initialValue: "item1, item2, item3",
    multiple: true,
  },
}

export const MultiplePopups: Story = {
  render: () => <MultiplePopupsDemo />,
}

export const ModalState: Story = {
  render: () => {
    const modalPopup = usePopupState({
      popupId: "modal",
      initialValue: "",
      multiple: false,
      onOpen: () => console.log("Modal opened"),
      onClose: () => console.log("Modal closed"),
    })

    return (
      <VStack>
        <Text fontSize="xl" fontWeight="bold">
          Modal-like Popup
        </Text>

        <Button colorScheme="blue" onClick={modalPopup.open} size="lg">
          Open Modal
        </Button>

        {modalPopup.value && (
          <VStack borderRadius="md" borderWidth={1} p="md">
            <Text fontWeight="bold">Entered data:</Text>
            <Text>{modalPopup.value}</Text>
          </VStack>
        )}

        <Modal onClose={modalPopup.close} open={modalPopup.isOpen}>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold">
              Modal-like Popup
            </Text>
          </ModalHeader>
          <ModalBody>
            <TextInput
              defaultValue={modalPopup.value}
              onChange={(e) => modalPopup.setValue(e.target.value)}
              placeholder="Enter data"
              size="sm"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={modalPopup.close}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </VStack>
    )
  },
}
