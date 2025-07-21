import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Float,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"

export const UserPanelSkeleton: FC = () => {
  return (
    <Card
      bg={["secondary.50", "secondary.900"]}
      layerStyle="gradientBorder"
      p={{ base: "md", md: "0", lg: "md" }}
      rounded="2xl"
      size="lg"
    >
      <CardHeader as={Center} flexDir="column" textAlign="center">
        <Box position="relative">
          <Skeleton borderRadius="full" height="80px" mb="xs" width="80px">
            <Avatar size="xl" />
          </Skeleton>
          <Float offset={[4, 4]} placement="end-end">
            <Skeleton borderRadius="full" height="32px" width="32px">
              <IconButton aria-label="Edit" rounded="full" size="sm" />
            </Skeleton>
          </Float>
        </Box>
        <VStack gap="xs" mt="sm">
          <Skeleton borderRadius="md" height="24px" width="120px">
            <Text fontSize="xl">&nbsp;</Text>
          </Skeleton>
          <Skeleton borderRadius="md" height="20px" width="80px">
            <Text fontSize="md">&nbsp;</Text>
          </Skeleton>
        </VStack>
      </CardHeader>
      <CardBody alignItems="center" gap="md">
        <VStack gap="xs" w="full">
          <Skeleton borderRadius="md" height="48px" w="full">
            <Text>Email</Text>
          </Skeleton>
          <Skeleton borderRadius="md" height="48px" w="full">
            <Text>Phone</Text>
          </Skeleton>
        </VStack>
      </CardBody>
      <CardFooter gap="sm" justifyContent="center">
        <Skeleton borderRadius="md" height="20px" width="120px">
          <Text fontSize="sm">&nbsp;</Text>
        </Skeleton>
      </CardFooter>
    </Card>
  )
}

UserPanelSkeleton.displayName = "UserPanelSkeleton"
