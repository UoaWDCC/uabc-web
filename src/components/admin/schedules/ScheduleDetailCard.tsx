import { memo } from 'react'

import { DeleteScheduleFormDialog } from './DeleteScheduleFormDialog'
import { EditScheduleFormDialog } from './EditScheduleFormDialog'
import { useScheduleContext } from './SchedulesContext'
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
} from '@yamada-ui/react'
import { EllipsisIcon } from '@yamada-ui/lucide'

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
      <Card fontSize="sm" color="tertiary" variant="subtle">
        <CardHeader>
          <HStack w="full">
            <Heading as="h3" isTruncated fontSize="md" color={['black', 'white']}>
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

      <EditScheduleFormDialog open={editDisclosure.open} onClose={editDisclosure.onClose} />
      <DeleteScheduleFormDialog open={deleteDisclosure.open} onClose={deleteDisclosure.onClose} />
    </>
  )
}

export const ScheduleDetailCard = memo(UnmemoizedScheduleDetailCard)
