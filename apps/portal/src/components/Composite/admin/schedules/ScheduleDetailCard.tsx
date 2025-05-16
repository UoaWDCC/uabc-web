import { memo } from "react"

import { EllipsisIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
} from "@yamada-ui/react"
import { DeleteScheduleFormDialog } from "./DeleteScheduleFormDialog"
import { EditScheduleFormDialog } from "./EditScheduleFormDialog"
import { useScheduleContext } from "./SchedulesContext"

const UnmemoizedScheduleDetailCard = () => {
  const {
    weekday,
    startTime,
    endTime,
    locationName,
    locationAddress,
    memberCapacity,
    casualCapacity,
  } = useScheduleContext()
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()

  return (
    <>
      <Card color="tertiary" fontSize="sm" variant="subtle">
        <CardHeader>
          <HStack w="full">
            <Heading as="h3" color={["black", "white"]} fontSize="md" isTruncated>
              {weekday}
            </Heading>
            <Spacer />
            <Menu>
              <MenuButton as={IconButton} variant="ghost">
                <EllipsisIcon />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={editDisclosure.onOpen}>Edit</MenuItem>
                <MenuItem onClick={deleteDisclosure.onOpen}>Delete</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </CardHeader>
        <CardBody gap="sm" pt="sm">
          <Text>
            Session Time: {startTime} - {endTime}
          </Text>
          <Text>Venue Name: {locationName}</Text>
          <Text>Address: {locationAddress}</Text>
          <Text>Member capacity: {memberCapacity}</Text>
          <Text>Casual capacity: {casualCapacity}</Text>
        </CardBody>
      </Card>

      <EditScheduleFormDialog onClose={editDisclosure.onClose} open={editDisclosure.open} />
      <DeleteScheduleFormDialog onClose={deleteDisclosure.onClose} open={deleteDisclosure.open} />
    </>
  )
}

export const ScheduleDetailCard = memo(UnmemoizedScheduleDetailCard)
