'use client'

import Link from 'next/link'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@yamada-ui/react'

import { DeleteGameSessionFormDialog } from './DeleteGameSessionFormDialog'
import {
  ClockIcon,
  EllipsisIcon,
  FilePenLineIcon,
  MapPinIcon,
  Trash2Icon,
  UsersIcon,
} from '@yamada-ui/lucide'
import { EditGameSessionFormDialog } from './EditGameSessionFormDialog'

interface AdminViewSessionCardProps {
  id: number
  title: string
  startTime: string
  endTime: string
  locationName: string
  locationAddress: string
  attendees: number
  totalCapacity: number
  state: 'ongoing' | 'past' | 'upcoming'
}

export function AdminViewSessionCard({
  id,
  title,
  startTime,
  endTime,
  locationName,
  locationAddress,
  attendees,
  totalCapacity,
  state,
}: AdminViewSessionCardProps) {
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()
  return (
    <Card variant="outline" w="full" size="lg">
      <CardHeader justifyContent="space-between">
        <Text fontSize="lg" fontWeight="medium" lineHeight="1">
          {title}
        </Text>
        {state === 'upcoming' ? (
          <>
            <Menu>
              <MenuButton as={IconButton} variant="ghost" h="6">
                <EllipsisIcon />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={editDisclosure.onOpen}
                  icon={<FilePenLineIcon color={['black', 'white']} />}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={deleteDisclosure.onOpen}
                  icon={<Trash2Icon color="danger" />}
                  color="danger"
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
            <EditGameSessionFormDialog
              open={editDisclosure.open}
              onClose={editDisclosure.onClose}
            />
            <DeleteGameSessionFormDialog
              open={deleteDisclosure.open}
              onClose={deleteDisclosure.onClose}
            />
          </>
        ) : (
          <Badge
            pointerEvents="none"
            userSelect="none"
            colorScheme={state === 'ongoing' ? 'green' : 'gray'}
          >
            {state === 'ongoing' ? 'Ongoing' : 'Past'}
          </Badge>
        )}
      </CardHeader>
      <CardBody>
        <List fontSize="sm" fontWeight="medium" color="tertiary">
          <ListItem display="flex" gap="sm" alignItems="center">
            <ClockIcon fontSize={24} />
            <Text>
              {startTime} - {endTime}
            </Text>
          </ListItem>
          <ListItem display="flex" gap="sm" alignItems="center">
            <MapPinIcon fontSize={24} />
            <Text lineHeight="tight">
              {locationName} <br /> {locationAddress}
            </Text>
          </ListItem>
          <ListItem display="flex" gap="sm" alignItems="center">
            <UsersIcon fontSize={24} />
            <Text>
              {attendees} / {totalCapacity} attendees
            </Text>
          </ListItem>
        </List>
      </CardBody>
      <CardFooter>
        <Button
          as={Link}
          href={`/admin/view-sessions/${id}`}
          w="full"
          disabled={attendees === 0}
          colorScheme="primary"
        >
          View attendees list
        </Button>
      </CardFooter>
    </Card>
  )
}
