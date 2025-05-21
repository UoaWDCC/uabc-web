"use client"

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
} from "@yamada-ui/react"
import Link from "next/link"

import {
  ClockIcon,
  EllipsisIcon,
  FilePenLineIcon,
  MapPinIcon,
  Trash2Icon,
  UsersIcon,
} from "@yamada-ui/lucide"
import { DeleteGameSessionFormDialog } from "./DeleteGameSessionFormDialog"
import { EditGameSessionFormDialog } from "./EditGameSessionFormDialog"

interface AdminViewSessionCardProps {
  id: number
  title: string
  startTime: string
  endTime: string
  locationName: string
  locationAddress: string
  attendees: number
  totalCapacity: number
  state: "ongoing" | "past" | "upcoming"
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
    <Card size="lg" variant="outline" w="full">
      <CardHeader justifyContent="space-between">
        <Text fontSize="lg" fontWeight="medium" lineHeight="1">
          {title}
        </Text>
        {state === "upcoming" ? (
          <>
            <Menu>
              <MenuButton as={IconButton} h="6" variant="ghost">
                <EllipsisIcon />
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<FilePenLineIcon color={["black", "white"]} />}
                  onClick={editDisclosure.onOpen}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  color="danger"
                  icon={<Trash2Icon color="danger" />}
                  onClick={deleteDisclosure.onOpen}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
            <EditGameSessionFormDialog
              onClose={editDisclosure.onClose}
              open={editDisclosure.open}
            />
            <DeleteGameSessionFormDialog
              onClose={deleteDisclosure.onClose}
              open={deleteDisclosure.open}
            />
          </>
        ) : (
          <Badge
            colorScheme={state === "ongoing" ? "green" : "gray"}
            pointerEvents="none"
            userSelect="none"
          >
            {state === "ongoing" ? "Ongoing" : "Past"}
          </Badge>
        )}
      </CardHeader>
      <CardBody>
        <List color="tertiary" fontSize="sm" fontWeight="medium">
          <ListItem alignItems="center" display="flex" gap="sm">
            <ClockIcon fontSize={24} />
            <Text>
              {startTime} - {endTime}
            </Text>
          </ListItem>
          <ListItem alignItems="center" display="flex" gap="sm">
            <MapPinIcon fontSize={24} />
            <Text lineHeight="tight">
              {locationName} <br /> {locationAddress}
            </Text>
          </ListItem>
          <ListItem alignItems="center" display="flex" gap="sm">
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
          colorScheme="primary"
          disabled={attendees === 0}
          href={`/admin/view-sessions/${id}`}
          w="full"
        >
          View attendees list
        </Button>
      </CardFooter>
    </Card>
  )
}
