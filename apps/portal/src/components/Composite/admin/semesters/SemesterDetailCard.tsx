import { EllipsisIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
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
} from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import { convertTo12HourFormat, formatFullDate } from "@/lib/utils/dates"
import { DeleteSemesterFormDialog } from "./DeleteSemesterFormDialog"
import { EditSemesterFormDialog } from "./EditSemesterFormDialog"
import { useSemesterContext } from "./SemestersContext"

const UnmemoizedSemesterDetailCard = () => {
  const { id, name, startDate, endDate, breakStart, breakEnd, bookingOpenDay, bookingOpenTime } =
    useSemesterContext()
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()

  return (
    <>
      <Card as={LinkBox} color="tertiary" fontSize="sm" variant="subtle">
        <LinkOverlay as={Link} href={`semesters/${id}/schedules`} />
        <CardHeader>
          <HStack w="full">
            <Heading as="h3" color={["black", "white"]} fontSize="md" isTruncated>
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
            Bookings open {formatFullDate(bookingOpenDay).toLocaleString()} at{" "}
            {convertTo12HourFormat(bookingOpenTime)}
          </Text>
          <Text>Start date: {formatFullDate(startDate).toLocaleString()}</Text>
          <Text>End date: {formatFullDate(endDate).toLocaleString()}</Text>
          <Text>
            Break period: {breakStart} - {breakEnd}
          </Text>
        </CardBody>
      </Card>

      <EditSemesterFormDialog onClose={editDisclosure.onClose} open={editDisclosure.open} />
      <DeleteSemesterFormDialog onClose={deleteDisclosure.onClose} open={deleteDisclosure.open} />
    </>
  )
}

export const SemesterDetailCard = memo(UnmemoizedSemesterDetailCard)
