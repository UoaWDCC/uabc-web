"use client"

import { Heading, Image } from "@repo/ui/components/Primitive"
import { Button, Center, DiscList, ListItem, Loading, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function UserPage() {
  const { user, isLoading, isPending, error } = useAuth()

  if (isLoading || isPending) {
    return (
      <Center minH="50vh">
        <Loading boxSize="sm" />
      </Center>
    )
  }

  if (error) {
    return <Text>Error: {error}</Text>
  }

  if (!user) {
    return (
      <Center minH="50vh">
        <VStack>
          <Text>No user is currently logged in.</Text>
          <Button as={Link} colorScheme="primary" href="/login">
            Go to Login
          </Button>
        </VStack>
      </Center>
    )
  }

  return (
    <VStack>
      <Heading.h2>User Info</Heading.h2>
      <DiscList>
        <ListItem>
          <Text as="strong">ID:</Text> {user.id}
        </ListItem>
        <ListItem>
          <Text as="strong">Email:</Text> {user.email}
        </ListItem>
        <ListItem>
          <Text as="strong">First Name:</Text> {user.firstName}
        </ListItem>
        <ListItem>
          <Text as="strong">Last Name:</Text> {user.lastName ?? "-"}
        </ListItem>
        <ListItem>
          <Text as="strong">Role:</Text> {user.role}
        </ListItem>
        {user.remainingSessions !== undefined && (
          <ListItem>
            <Text as="strong">Remaining Sessions:</Text> {user.remainingSessions ?? "-"}
          </ListItem>
        )}
        {user.image && (
          <ListItem>
            <Text as="strong">Image:</Text>{" "}
            {typeof user.image === "string" ? (
              <Image alt="User" src={user.image} style={{ maxWidth: 80, borderRadius: 8 }} />
            ) : (
              user.image.url && (
                <Image alt="User" src={user.image.url} style={{ maxWidth: 80, borderRadius: 8 }} />
              )
            )}
          </ListItem>
        )}
        <ListItem>
          <Text as="strong">Created At:</Text> {user.createdAt}
        </ListItem>
        <ListItem>
          <Text as="strong">Updated At:</Text> {user.updatedAt}
        </ListItem>
      </DiscList>
    </VStack>
  )
}
