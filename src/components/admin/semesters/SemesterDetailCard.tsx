import Link from 'next/link'
import { memo } from 'react'

import { convertTo12HourFormat, formatFullDate } from '@/lib/utils/dates'
import { EllipsisIcon } from '@yamada-ui/lucide'
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
} from '@yamada-ui/react'
import { DeleteSemesterFormDialog } from './DeleteSemesterFormDialog'
import { EditSemesterFormDialog } from './EditSemesterFormDialog'
import { useSemesterContext } from './SemestersContext'

const UnmemoizedSemesterDetailCard = () => {
  const { id, name, startDate, endDate, breakStart, breakEnd, bookingOpenDay, bookingOpenTime } =
    useSemesterContext()
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()

  return (
    <>
      <Card as={LinkBox} fontSize="sm" color="tertiary" variant="subtle">
        <LinkOverlay as={Link} href={`semesters/${id}/schedules`} />
        <CardHeader>
          <HStack w="full">
            <Heading as="h3" isTruncated fontSize="md" color={['black', 'white']}>
              {name}
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
          <Text
            textDecoration="underline"
            textDecorationColor="transparentize(tertiary, 50%)"
            textDecorationThickness="1"
            textUnderlineOffset="4"
          >
            Bookings open {formatFullDate(bookingOpenDay).toLocaleString()} at{' '}
            {convertTo12HourFormat(bookingOpenTime)}
          </Text>
          <Text>Start date: {formatFullDate(startDate).toLocaleString()}</Text>
          <Text>End date: {formatFullDate(endDate).toLocaleString()}</Text>
          <Text>
            Break period: {breakStart} - {breakEnd}
          </Text>
        </CardBody>
      </Card>

      <EditSemesterFormDialog open={editDisclosure.open} onClose={editDisclosure.onClose} />
      <DeleteSemesterFormDialog open={deleteDisclosure.open} onClose={deleteDisclosure.onClose} />
    </>
  )
}

export const SemesterDetailCard = memo(UnmemoizedSemesterDetailCard)
