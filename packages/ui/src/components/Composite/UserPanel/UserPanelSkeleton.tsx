import { IconButton } from "@repo/ui/components/Primitive"
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
          <Skeleton borderRadius="full" mb="xs">
            <Avatar size="xl" />
          </Skeleton>
          <Float offset={[4, 4]} placement="end-end">
            <IconButton aria-label="Edit" disabled icon={<PencilIcon />} rounded="full" size="xs" />
          </Float>
        </Box>
        <VStack>
          <Skeleton alignSelf="center">
            <Text>University of Auckland Badminton Club</Text>
            <Text>Casual</Text>
          </Skeleton>
        </VStack>
      </CardHeader>
      <CardBody alignItems="center" gap="md">
        <VStack w="full">
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
