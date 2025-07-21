import { PencilIcon } from "@yamada-ui/lucide"
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
            <IconButton aria-label="Edit" disabled icon={<PencilIcon />} rounded="full" size="sm" />
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
          <VStack
            alignSelf="center"
            border="2px solid"
            borderColor={["blackAlpha.200", "whiteAlpha.300"]}
            gap="xs"
            maxW="md"
            minW={0}
            px="md"
            py="sm"
            rounded="lg"
            w="full"
          >
            <Text color="muted" fontSize="sm">
              Email
            </Text>
            <Skeleton borderRadius="md" height="20px" width="80%">
              <Text>&nbsp;</Text>
            </Skeleton>
          </VStack>
          <VStack
            alignSelf="center"
            border="2px solid"
            borderColor={["blackAlpha.200", "whiteAlpha.300"]}
            gap="xs"
            maxW="md"
            minW={0}
            px="md"
            py="sm"
            rounded="lg"
            w="full"
          >
            <Text color="muted" fontSize="sm">
              Phone
            </Text>
            <Skeleton borderRadius="md" height="20px" width="80%">
              <Text>&nbsp;</Text>
            </Skeleton>
          </VStack>
        </VStack>
      </CardBody>
      <CardFooter gap="sm" justifyContent="center">
        {/* ShuttleIcon is not shown in skeleton, but keep Sessions left label */}
        <Text fontSize="sm">Sessions left:</Text>
        <Skeleton borderRadius="md" height="20px" width="40px">
          <Text fontSize="sm">&nbsp;</Text>
        </Skeleton>
      </CardFooter>
    </Card>
  )
}

UserPanelSkeleton.displayName = "UserPanelSkeleton"
